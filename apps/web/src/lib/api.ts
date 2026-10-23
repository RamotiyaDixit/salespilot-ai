export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export async function getDashboard(filters: { period: string; manager: string; stage: string }) {
 const query = new URLSearchParams(filters); const response = await fetch(`${API_URL}/api/dashboard?${query.toString()}`, { cache: "no-store" });
 if (!response.ok) throw new Error("Could not load dashboard"); return response.json();
}
