import { useEffect, useState } from "react";
import { fetchOverview } from "../viewmodels/overviewVM";
import "../style/overview.css"; // Assuming you have a CSS file for styling
import {
  FaArrowDown,
  FaArrowUp,
  FaWallet,
  FaCalendarAlt,
} from "react-icons/fa";


export default function Overview() {
  const [overview, setOverview] = useState({
    grand: null,
    current: null,
    data: [],
  });

  useEffect(() => {
    fetchOverview().then(setOverview);
  }, []);

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="grid grid-5">


        {/* Grand totals */}

        {/* investment: Number(row[1] || 0),
        insurance: Number(row[2] || 0),
        savings: Number(row[3] || 0),
        spending: Number(row[4] || 0),
        received: Number(row[5] || 0),
        credit: Number(row[6] || 0),
        debit: Number(row[7] || 0), */}
        <StatCard
          title={`${overview.current?.year} Invest`}
          value={overview.current?.investment ?? 0}
          icon={<FaArrowUp color="#4CAF50" />}
        />
        <StatCard
          title={`${overview.current?.year} Saving`}
          value={overview.current?.savings ?? 0}
          icon={<FaArrowDown color="#F44336" />}
        />

        <StatCard
          title={`${overview.current?.year} Insurance`}
          value={overview.current?.insurance ?? 0}
          icon={<FaArrowUp color="#4CAF50" />}
        />
        <StatCard
          title={`${overview.current?.year} Spending`}
          value={overview.current?.spending ?? 0}
          icon={<FaArrowDown color="#F44336" />}
        />

        <StatCard
          title={`${overview.current?.year} Reciveing`}
          value={overview.current?.received ?? 0}
          icon={<FaArrowDown color="#F44336" />}
        />


        {/* Current year */}
        <StatCard
          title={`${overview.current?.year} Credit`}
          value={overview.current?.credit ?? 0}
          icon={<FaArrowUp color="#4CAF50" />}
        />
        <StatCard
          title={`${overview.current?.year} Debit`}
          value={overview.current?.debit ?? 0}
          icon={<FaArrowDown color="#F44336" />}
        />
        {/* <StatCard title={`Year ${new Date().getFullYear()} Net`} value={overview.current?.net ?? 0} /> */}
      </div>

      {/* Table */}
      <div className="card">
        <h4>Yearly Summary</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Investment</th>
              <th>Insurance</th>
              <th>Savings</th>
              <th>Spending</th>
              <th>Received</th>
              <th>Credit</th>
              <th>Debit</th>
            </tr>
          </thead>
          <tbody>
            {overview.data.map((d, i) => (
              <tr key={i}>
                <td data-label="Date">{d.year}</td>
                <td data-label="Investment">{d.investment}</td>
                <td data-label="Insurance">{d.insurance}</td>
                <td data-label="Savings">{d.savings}</td>
                <td data-label="Spending" >{d.spending}</td>
                <td data-label="Received">{d.received}</td>
                <td data-label="Credit" style={{ color: "#4CAF50", fontWeight: 600 }}>
                  {fmt(d.credit)}
                </td>
                <td data-label="Debit" style={{ color: "#F44336", fontWeight: 600 }}>
                  {fmt(d.debit)}
                </td>
              </tr>
            ))}
            {!overview.data.length && (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", color: "gray", padding: 20 }}
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div
      className="card"
      style={{ display: "flex", alignItems: "center", gap: 12 }}
    >
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div>
        <h4 style={{ margin: 0 }}>{title}</h4>
        <div className="stat">
          <strong>{fmt(value)}</strong>
        </div>
      </div>
    </div>
  );
}

const fmt = (n) =>
  (n ?? 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
