import { useEffect, useMemo, useState } from "react";
import { fetchTransactions } from "../viewmodels/transactionsVM";
import "../style/Transactions.css"; // Assuming you have a CSS file for styling
export default function Transactions() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [type, setType] = useState("all"); // new filter
  const [q, setQ] = useState("");          // search
  const [data, setData] = useState([]);

  useEffect(() => { fetchTransactions(year).then(setData); }, [year]);

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
            <tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th></tr>
          </thead>
    <tbody>
  {filtered.map((t, i) => (

    <tr key={i}>
      <td data-label="Date">{t.date}</td>
      <td data-label="Type">
        {t.type === "credit" 
          ? <span className="badge in">credit</span> 
          : <span className="badge out">debit</span>}
      </td>

      <td data-label="Date">{t.category}</td>
      {/* <td data-label="Description">{t.description}</td> */}
      <td data-label="Balance">{fmt(t.amount)}</td>
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
