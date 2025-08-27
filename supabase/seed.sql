-- =====================================================
-- SCRIPT DE SEMILLAS: DATOS INICIALES COTIZAI
-- =====================================================

-- =====================================================
-- HELPERS PARA CONFIGURAR ROLES DE USUARIO
-- =====================================================

-- Función helper para cambiar rol de usuario por email
CREATE OR REPLACE FUNCTION set_user_role(user_email TEXT, new_role user_role)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET role = new_role 
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario con email % no encontrado', user_email;
    END IF;
    
    RAISE NOTICE 'Rol de % cambiado a %', user_email, new_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DATOS DE EJEMPLO: SUPPLIERS
-- =====================================================

INSERT INTO suppliers (name, contact, brand, is_active) VALUES
('HandwareMarket S.A.', 'contacto@handwaremarket.com', 'HandwareMarket', true),
('HWS Logística', 'ventas@hwsl.com', 'HWS Logística', true),
('CGN Distribuidora', 'info@cgn.com.mx', 'CGN', true),
('Maszione México', 'pedidos@maszione.com', 'Maszione', true),
('Modazona Express', 'servicio@modazona.com', 'Modazona', true);

-- =====================================================
-- DATOS DE EJEMPLO: PRODUCTS
-- =====================================================

INSERT INTO products (sku, name, brand, unit, category, is_active) VALUES
('HM-001', 'Laptop HP Pavilion 15"', 'HandwareMarket', 'pza', 'Electrónicos', true),
('HM-002', 'Mouse Inalámbrico Logitech', 'HandwareMarket', 'pza', 'Accesorios', true),
('HWS-001', 'Servicio de Envío Express', 'HWS Logística', 'servicio', 'Logística', true),
('CGN-001', 'Monitor Dell 24" Full HD', 'CGN', 'pza', 'Monitores', true),
('MZ-001', 'Teclado Mecánico RGB', 'Maszione', 'pza', 'Periféricos', true),
('MDZ-001', 'Auriculares Gaming Pro', 'Modazona', 'pza', 'Audio', true);

-- =====================================================
-- DATOS DE EJEMPLO: MARGIN_RULES
-- =====================================================

INSERT INTO margin_rules (brand, zone, volume_min, volume_max, base_margin_percent) VALUES
('HandwareMarket', 'Norte', 1, 10, 15.00),
('HandwareMarket', 'Norte', 11, 50, 18.00),
('HandwareMarket', 'Norte', 51, 100, 20.00),
('HWS Logística', 'Centro', 1, 25, 12.00),
('HWS Logística', 'Centro', 26, 100, 15.00),
('CGN', 'Sur', 1, 20, 16.00),
('CGN', 'Sur', 21, 75, 19.00),
('Maszione', 'Este', 1, 15, 14.00),
('Maszione', 'Este', 16, 60, 17.00),
('Modazona', 'Oeste', 1, 30, 13.00),
('Modazona', 'Oeste', 31, 80, 16.00);

-- =====================================================
-- DATOS DE EJEMPLO: COMMISSION_RULES
-- =====================================================

INSERT INTO commission_rules (seller_email, role, percent) VALUES
('ventas1@tu-dominio.com', 'ventas', 5.00),
('ventas2@tu-dominio.com', 'ventas', 5.50),
('ventas3@tu-dominio.com', 'ventas', 6.00),
('compras1@tu-dominio.com', 'compras', 2.00),
('admin@tu-dominio.com', 'admin', 0.00);

-- =====================================================
-- DATOS DE EJEMPLO: QUOTES (para testing)
-- =====================================================

-- Nota: Estas cotizaciones se crearán cuando tengas usuarios reales
-- Por ahora son solo ejemplos de estructura

-- =====================================================
-- INSTRUCCIONES PARA CONFIGURAR ROLES
-- =====================================================

-- Para configurar roles de usuario, ejecuta estos comandos:

-- 1. Configurar usuario como 'compras':
-- SELECT set_user_role('gabino@tu-dominio.com', 'compras');

-- 2. Configurar usuario como 'admin':
-- SELECT set_user_role('tu-admin@tu-dominio.com', 'admin');

-- 3. Verificar roles actuales:
-- SELECT email, role FROM profiles ORDER BY role, email;

-- =====================================================
-- DATOS DE PRUEBA PARA DESARROLLO
-- =====================================================

-- Si quieres probar con datos ficticios, puedes descomentar estas líneas:

/*
-- Usuario de prueba para compras
INSERT INTO profiles (id, email, role) VALUES 
('11111111-1111-1111-1111-111111111111', 'compras@test.com', 'compras');

-- Usuario de prueba para admin  
INSERT INTO profiles (id, email, role) VALUES 
('22222222-2222-2222-2222-222222222222', 'admin@test.com', 'admin');

-- Usuario de prueba para ventas
INSERT INTO profiles (id, email, role) VALUES 
('33333333-3333-3333-3333-333333333333', 'ventas@test.com', 'ventas');
*/

-- =====================================================
-- VERIFICACIÓN DE DATOS
-- =====================================================

-- Verificar que los datos se insertaron correctamente
SELECT 'Suppliers' as tabla, COUNT(*) as total FROM suppliers
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Margin Rules', COUNT(*) FROM margin_rules
UNION ALL
SELECT 'Commission Rules', COUNT(*) FROM commission_rules
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles;

-- Mostrar reglas de margen por marca
SELECT 
    brand,
    zone,
    volume_min,
    volume_max,
    base_margin_percent
FROM margin_rules 
ORDER BY brand, zone, volume_min;

-- Mostrar reglas de comisión
SELECT 
    seller_email,
    role,
    percent
FROM commission_rules 
ORDER BY role, percent;
