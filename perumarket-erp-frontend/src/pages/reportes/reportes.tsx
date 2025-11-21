import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// IMPORTAR REACT ICONS
import {
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
} from "react-icons/fi";

const sampleChart = [
  { month: "Jan", a: 5, b: 3 },
  { month: "Feb", a: 8, b: 5 },
  { month: "Mar", a: 12, b: 10 },
  { month: "Apr", a: 18, b: 15 },
  { month: "May", a: 25, b: 20 },
  { month: "Jun", a: 28, b: 22 },
  { month: "Jul", a: 30, b: 25 },
  { month: "Aug", a: 27, b: 23 },
  { month: "Sep", a: 20, b: 16 },
  { month: "Oct", a: 14, b: 11 },
  { month: "Nov", a: 9, b: 7 },
  { month: "Dec", a: 6, b: 4 },
];

// Aquí reemplazo los emojis por React Icons
const cards = [
  { title: "Productos Registrados", value: "1,029", icon: <FiBox size={28} /> },
  { title: "Ventas", value: "S/ 0.00", icon: <FiShoppingCart size={28} /> },
  { title: "Gastos", value: "S/ 0.00", icon: <FiDollarSign size={28} /> },
  { title: "Total de Ventas", value: "S/ 0.00", icon: <FiTrendingUp size={28} /> },
  { title: "Total de Ganancias", value: "S/ 0.00", icon: <FiPieChart size={28} /> },
  { title: "Total Ganancias Netas", value: "S/ 0.00", icon: <FiBarChart2 size={28} /> },
  { title: "Ganancia Bruta", value: "S/ 0.00", icon: <FiTrendingUp size={28} /> },
  { title: "Ventas del día", value: "S/ 0.00", icon: <FiCalendar size={28} /> },
];

const proveedores = [
  { nombre: "Fiorela Lizbeth Mamani", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "María Pérez González", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Carlos Ramírez Torres", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Ana López Martínez", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Juan Gómez Sánchez", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
  { nombre: "Laura Fernández Castro", ventas: 0, total: "S/0.00", porcentaje: "0.0%" },
];

export default function Reportes() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* CARDS */}
      <div className="flex items-start gap-4">
        <div className="grid grid-cols-4 gap-4 w-full">
          {cards.map((c, i) => (
            <div
              className="min-w-[170px] bg-white shadow rounded-xl p-4 border"
              key={i}
            >
              <div className="text-2xl mb-2 text-blue-600">{c.icon}</div>
              <div className="font-semibold text-sm">{c.title}</div>
              <div className="mt-2 text-gray-600">{c.value}</div>
            </div>
          ))}
        </div>

        {/* BOTÓN GENERAR REPORTE */}
        <div className="relative">
          <button
            onClick={() => setOpen((s) => !s)}
            className="bg-blue-600 text-white px-3 py-2 rounded-md shadow h-10"
          >
            <span className="mr-2">▾</span> Generar Reporte
          </button>

          <div
            className={`absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md border transition-transform ${
              open
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
            style={{ transitionDuration: "180ms" }}
          >
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
              Compras
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
              Inventario
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50">
              Pedidos
            </button>
          </div>
        </div>
      </div>

      {/* GRÁFICO + TABLA */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 border">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sampleChart}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="a"
                  stroke="#6B46C1"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="b"
                  stroke="#F97373"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-xl shadow p-4 border">
          <h3 className="font-semibold mb-3">Ventas por Proveedor</h3>
          <div className="text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Vendedor</th>
                  <th className="py-2">#Ventas</th>
                  <th className="py-2">Total(S/)</th>
                  <th className="py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{p.nombre}</td>
                    <td>{p.ventas}</td>
                    <td>{p.total}</td>
                    <td>{p.porcentaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
