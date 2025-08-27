import { sheetsValuesGet } from "../google";

// Example: you might later group transactions by category (food, rent, etc.)
export async function fetchCategories(year) {
  const values = await sheetsValuesGet(`${year}!A2:G10000`);
  return values.map((row) => ({
    category: row[6] || "Uncategorized",
    amount: Number(row[3] || 0) + Number(row[4] || 0),
  }));
}
