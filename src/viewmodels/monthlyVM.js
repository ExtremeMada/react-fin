import { sheetsValuesGet } from "../google";

let monthOverviewCache = null;
let monthOverviewCacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchMonthOverview() {
  const now = Date.now();

  // ✅ Use cache if still valid
  if (
    monthOverviewCache &&
    monthOverviewCacheTimestamp &&
    now - monthOverviewCacheTimestamp < CACHE_TTL
  ) {
    return monthOverviewCache;
  }

  try {
    const values = await sheetsValuesGet("Month-Overview!A2:I1000");

    const data = values.map((row) => ({
      year: row[0],
      month: row[1],
      invest:row[2],
      insurance:row[3],
      saving:row[4],
      speding:row[5],
      received:row[6],
      credit: Number(row[7] || 0),
      debit: Number(row[8] || 0),
    }));

    // ✅ Save in cache
    monthOverviewCache = data;
    monthOverviewCacheTimestamp = now;

    return data;

  } catch (error) {
    console.error("Error fetching month overview:", error);
    return [];
  }
}
