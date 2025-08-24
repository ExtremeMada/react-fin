import { useEffect, useMemo, useState } from "react";
import { fetchMonthOverview } from "../viewmodels/monthlyVM";
import "../style/Transactions.css"; // Assuming you have a CSS file for styling

export default function Monthlyview() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [type, setType] = useState("all"); // new filter
  const [q, setQ] = useState("");          // search
  const [data, setData] = useState([]);

  useEffect(() => { fetchMonthOverview(year).then(setData); }, [year]);

  const filtered = useMemo(() => {
    return data.filter((t) => {
      const byType = type === "all" || t.type === type;
      const byQ = q.trim()===""
        || (t.description||"").toLowerCase().includes(q.toLowerCase());
      return byType && byQ;
    });
  }, [data, type, q]);

  return (
    <div className="grid" style={{ gap: 16 }}>
    <div className="card filter-bar">
  <label>
    Year:
    <input
      className="input"
      type="number"
      value={year}
      onChange={(e)=>setYear(e.target.value)}
    />
  </label>

  <label>
    Type:
    <select
      className="input"
      value={type}
      onChange={(e)=>setType(e.target.value)}
    >
      <option value="all">All</option>
      <option value="credit">Credit</option>
      <option value="debit">Debit</option>
    </select>
  </label>

  <input
    className="input search"
    placeholder="Search description…"
    value={q}
    onChange={(e)=>setQ(e.target.value)}
  />
</div>


      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Year</th><th>Month</th><th>invest</th><th>insurance</th><th>saving</th><th>speding</th><th>received</th><th>Credit</th><th>Debit</th></tr>
          </thead>
    <tbody>
  {filtered.map((t, i) => (
    <tr key={i}>
      <td data-label="Date">{t.year}</td>
      <td data-label="Date">{t.month}</td>
      <td data-label="invest">{t.invest}</td>
      <td data-label="insurance">{t.insurance}</td>
      <td data-label="saving">{t.saving}</td>
      <td data-label="speding">{t.speding}</td>
      <td data-label="received">{t.received}</td>
      <td data-label="credit">{t.credit}</td>
      <td data-label="debit">{fmt(t.debit)}</td>
    </tr>
  ))}
  {!filtered.length && (
    <tr>
      <td colSpan="6" style={{ color:"var(--text-dim)", textAlign:"center", padding:20 }}>
        No transactions
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}

const fmt = (n)=> (n??0).toLocaleString("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0});
