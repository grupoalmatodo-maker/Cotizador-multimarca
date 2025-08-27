export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Test Tailwind CSS</h1>
        <p className="text-gray-700 mb-4">Si ves colores y estilos, Tailwind está funcionando.</p>
        <div className="space-y-2">
          <div className="w-32 h-8 bg-red-500 rounded"></div>
          <div className="w-32 h-8 bg-green-500 rounded"></div>
          <div className="w-32 h-8 bg-blue-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}
