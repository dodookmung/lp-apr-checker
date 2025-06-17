// src/app/api/pools/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const url = `https://api.dexscreener.com/latest/dex/pairs/solana/${token}`

  try {
    const resp = await fetch(url)
    const data = await resp.json()

    const pools = (data.pairs || []).map((pair: any) => {
      const liquidity = parseFloat(pair.liquidity?.usd || 0)
      const volume24h = parseFloat(pair.volume?.h24 || 0)
      const dailyFee = volume24h * 0.002
      const apr = liquidity > 0 ? (dailyFee / liquidity) * 365 * 100 : 0

      return {
        name: `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`,
        liquidity_usd: liquidity,
        volume_usd_24h: volume24h,
        apr: apr.toFixed(2),
      }
    })

    return NextResponse.json({ pools })
  } catch (e) {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}
