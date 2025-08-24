import { sheetsValuesGet } from "../google";
const transactionsCache = new Map(); // year → { data, timestamp }
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchTransactions(year) {
  const now = Date.now();

  // ✅ Check cache
  if (transactionsCache.has(year)) {
    const { data, timestamp } = transactionsCache.get(year);
    if (now - timestamp < CACHE_TTL) {
      return data;
    }
  }

  try {
    const values = await sheetsValuesGet(`${year}!A2:D10000`);
    const data = values.map((row) => ({
      date: row[0],
      type: row[2],
      category: row[3],
      amount: Number(row[1] || 0),
    }));

    // ✅ Save in cache
    transactionsCache.set(year, { data, timestamp: now });

    return data;

  } catch (error) {
    console.error(`Error fetching transactions for ${year}:`, error);
    return [];
  }
}


