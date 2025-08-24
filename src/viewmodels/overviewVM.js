import { sheetsValuesGet } from "../google";

let overviewCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchOverview() {
  const now = Date.now();

  // ✅ If cache exists and is still valid, return it
  if (overviewCache && cacheTimestamp && now - cacheTimestamp < CACHE_TTL) {
    return overviewCache;
  }

  try {
    const values = await sheetsValuesGet("Overview!A2:H1000");
    const currentYear = new Date().getFullYear().toString();

    let grand = null;
    let current = null;
    const rows = [];

    values.forEach((row) => {
      const year = row[0];
      const record = {
        year: year,
        investment: Number(row[1] || 0),
        insurance: Number(row[2] || 0),
        savings: Number(row[3] || 0),
        spending: Number(row[4] || 0),
        received: Number(row[5] || 0),
        credit: Number(row[6] || 0),
        debit: Number(row[7] || 0),
      };

      if (year?.toLowerCase() === "grand total") {
        grand = record;
      } else if (year === currentYear) {
        current = record;
      } else {
        rows.push(record);
      }
    });

    // ✅ Save result to cache
    overviewCache = { grand, current, data: rows };
    cacheTimestamp = now;

    return overviewCache;

  } catch (error) {
    console.error("Error fetching overview:", error);
    return { grand: null, current: null, data: [] };
  }
}
