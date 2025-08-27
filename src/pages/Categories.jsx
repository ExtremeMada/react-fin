import { useEffect, useState } from "react";
import { fetchCategories } from "../viewmodels/categoriesVM";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#60a5fa","#34d399","#f87171","#fbbf24","#a78bfa","#22d3ee","#f472b6"];

export default function Categories() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState([]);

  useEffect(() => { fetchCategories(year).then(setData); }, [year]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card" style={{ display:"flex", gap:12, alignItems:"center" }}>
        <label>Year: <input className="input" type="number" value={year} onChange={(e)=>setYear(e.target.value)} /></label>
      </div>

      <div className="card">
        <h4>Spending by Category</h4>
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie dataKey="amount" data={data} cx="50%" cy="50%" outerRadius={140} label>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
