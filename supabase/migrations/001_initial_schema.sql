-- =====================================================
-- MIGRACIÓN INICIAL: ESQUEMA COMPLETO COTIZAI
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('admin', 'compras', 'ventas');
CREATE TYPE quote_status AS ENUM ('draft', 'sent', 'won', 'lost');

-- =====================================================
-- TABLA PROFILES (usuarios del sistema)
-- =====================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'ventas',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA SUPPLIERS (proveedores)
-- =====================================================

CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT,
    brand TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA PRODUCTS (productos)
-- =====================================================

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT,
    unit TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA PRICE_LISTS (listas de precios)
-- =====================================================

CREATE TABLE price_lists (
    id BIGSERIAL PRIMARY KEY,
    supplier_id BIGINT REFERENCES suppliers(id) ON DELETE CASCADE,
    file_url TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'processed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA PURCHASE_PRICES (precios de compra)
-- =====================================================

CREATE TABLE purchase_prices (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
    supplier_id BIGINT REFERENCES suppliers(id) ON DELETE CASCADE,
    cost NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'MXN',
    source_list_id BIGINT REFERENCES price_lists(id),
    valid_from DATE DEFAULT NOW(),
    valid_to DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA MARGIN_RULES (reglas de margen)
-- =====================================================

CREATE TABLE margin_rules (
    id BIGSERIAL PRIMARY KEY,
    brand TEXT,
    zone TEXT,
    volume_min INTEGER,
    volume_max INTEGER,
    base_margin_percent NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA COMMISSION_RULES (reglas de comisión)
-- =====================================================

CREATE TABLE commission_rules (
    id BIGSERIAL PRIMARY KEY,
    seller_email TEXT,
    role user_role,
    percent NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA QUOTES (cotizaciones)
-- =====================================================

CREATE TABLE quotes (
    id BIGSERIAL PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id),
    customer_name TEXT NOT NULL,
    brand TEXT,
    zone TEXT,
    volume INTEGER,
    subtotal NUMERIC(12,2),
    iva NUMERIC(12,2),
    total NUMERIC(12,2),
    commission_amount NUMERIC(12,2),
    utility_amount NUMERIC(12,2),
    status quote_status DEFAULT 'draft',
    lost_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLA QUOTE_ITEMS (items de cotización)
-- =====================================================

CREATE TABLE quote_items (
    id BIGSERIAL PRIMARY KEY,
    quote_id BIGINT REFERENCES quotes(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    quantity INTEGER,
    unit_price NUMERIC(12,2),
    line_total NUMERIC(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA FEEDBACK (retroalimentación)
-- =====================================================

CREATE TABLE feedback (
    id BIGSERIAL PRIMARY KEY,
    quote_id BIGINT REFERENCES quotes(id) ON DELETE CASCADE,
    reason TEXT,
    comment TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRIGGER PARA CREAR PROFILE AUTOMÁTICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'ventas');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- VISTAS PARA SEPARAR VISIBILIDAD POR ROL
-- =====================================================

-- Vista segura para ventas (sin costos)
CREATE VIEW v_quotes_sales AS
SELECT 
    q.id,
    q.customer_name,
    q.brand,
    q.zone,
    q.volume,
    q.subtotal,
    q.iva,
    q.total,
    q.status,
    q.created_at,
    p.email as seller_email
FROM quotes q
JOIN profiles p ON q.seller_id = p.id;

-- Vista segura para compras/admin (con costos)
CREATE VIEW v_purchase_prices_secure AS
SELECT 
    pp.id,
    p.sku,
    p.name as product_name,
    p.brand,
    s.name as supplier_name,
    pp.cost,
    pp.currency,
    pp.valid_from,
    pp.valid_to
FROM purchase_prices pp
JOIN products p ON pp.product_id = p.id
JOIN suppliers s ON pp.supplier_id = s.id;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE margin_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS
-- =====================================================

-- PROFILES: Usuario puede ver/editar solo su profile, admin puede ver todo
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- SUPPLIERS: Cualquier usuario autenticado puede ver, solo compras/admin pueden modificar
CREATE POLICY "Authenticated users can view suppliers" ON suppliers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Compras and admin can modify suppliers" ON suppliers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('compras', 'admin'))
    );

-- PRODUCTS: Cualquier usuario autenticado puede ver, solo compras/admin pueden modificar
CREATE POLICY "Authenticated users can view products" ON products
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Compras and admin can modify products" ON products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('compras', 'admin'))
    );

-- PRICE_LISTS: Solo compras/admin pueden ver/modificar
CREATE POLICY "Compras and admin can access price lists" ON price_lists
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('compras', 'admin'))
    );

-- PURCHASE_PRICES: Solo compras/admin pueden ver/modificar
CREATE POLICY "Compras and admin can access purchase prices" ON purchase_prices
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('compras', 'admin'))
    );

-- MARGIN_RULES: Cualquier usuario autenticado puede ver, solo admin puede modificar
CREATE POLICY "Authenticated users can view margin rules" ON margin_rules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify margin rules" ON margin_rules
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- COMMISSION_RULES: Cualquier usuario autenticado puede ver, solo admin puede modificar
CREATE POLICY "Authenticated users can view commission rules" ON commission_rules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify commission rules" ON commission_rules
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- QUOTES: Usuario puede ver sus propias cotizaciones, compras/admin pueden ver todas
CREATE POLICY "Users can view own quotes" ON quotes
    FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Users can insert own quotes" ON quotes
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update own quotes" ON quotes
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Compras and admin can view all quotes" ON quotes
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('compras', 'admin'))
    );

-- QUOTE_ITEMS: Visible si la cotización es visible para el usuario
CREATE POLICY "Users can view quote items for visible quotes" ON quote_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quotes q 
            WHERE q.id = quote_id 
            AND (q.seller_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('compras', 'admin')))
        )
    );

-- FEEDBACK: Usuario puede crear, visible si la cotización es visible, solo admin puede modificar
CREATE POLICY "Users can create feedback" ON feedback
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view feedback for visible quotes" ON feedback
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM quotes q 
            WHERE q.id = quote_id 
            AND (q.seller_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('compras', 'admin')))
        )
    );

CREATE POLICY "Admin can modify feedback" ON feedback
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_quotes_seller_id ON quotes(seller_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_quote_items_quote_id ON quote_items(quote_id);
CREATE INDEX idx_purchase_prices_product_id ON purchase_prices(product_id);
CREATE INDEX idx_purchase_prices_supplier_id ON purchase_prices(supplier_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_brand ON products(brand);

-- =====================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE profiles IS 'Perfiles de usuario con roles del sistema';
COMMENT ON TABLE suppliers IS 'Proveedores de productos';
COMMENT ON TABLE products IS 'Catálogo de productos';
COMMENT ON TABLE price_lists IS 'Listas de precios subidas por compras';
COMMENT ON TABLE purchase_prices IS 'Precios de compra por producto y proveedor';
COMMENT ON TABLE margin_rules IS 'Reglas de margen por marca, zona y volumen';
COMMENT ON TABLE commission_rules IS 'Reglas de comisión por vendedor';
COMMENT ON TABLE quotes IS 'Cotizaciones generadas por vendedores';
COMMENT ON TABLE quote_items IS 'Items individuales de cada cotización';
COMMENT ON TABLE feedback IS 'Retroalimentación de cotizaciones perdidas';
