// Cache route output for 5 minutes
// Cache route output for 5 minutes
import { NextResponse } from "next/server";

export const revalidate = 1800; // ⏱ Cache API route for 30 minutes (ISR)
const CMC_URL = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
const CMC_API_KEY = process.env.CMC_API_KEY;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbols = searchParams.get("symbols");
    if (!symbols) return NextResponse.json({ error: "No symbols provided" }, { status: 400 });

    //----- Fetch from CoinMarketCap -----
    const url = `${CMC_URL}?symbol=${encodeURIComponent(symbols)}&convert=USD`;
    const res = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY || "",
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`CoinMarketCap API error: ${errText}`);
    }
    const json = await res.json();
    return NextResponse.json({ data: json });
  } catch (err: any) {
    console.error("Error fetching prices:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
