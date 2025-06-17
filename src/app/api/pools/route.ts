import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  // 1️⃣ 토큰-풀 전용 엔드포인트
  const url = `https://api.dexscreener.com/token-pairs/v1/solana/${token}`

  try {
    const resp = await fetch(url)
    if (!resp.ok) {
      return NextResponse.json({ error: 'Dexscreener request failed' }, { status: 502 })
    }

    // 2️⃣ 반환이 배열임을 고려
    const pairs: any[] = await resp.json()

    // 3️⃣ 각 풀마다 APR 계산
    const pools = pairs.map((p) => {
      const liquidity = parseFloat(p.liquidity?.usd || '0')
      const vol24h = parseFloat(p.volume?.h24 || '0')
      const dailyFee = vol24h * 0.003  // PumpSwap LP 총 수수료율 0.30% 기준
      const apr = liquidity > 0 ? (dailyFee / liquidity) * 365 * 100 : 0

      return {
        name: `${p.baseToken.symbol}/${p.quoteToken.symbol}`,
        dex:  p.dexId,
        liquidity_usd: liquidity,
        volume_usd_24h: vol24h,
        apr: apr.toFixed(2),
      }
    })

    return NextResponse.json({ pools })
  } catch (e) {
    return NextResponse.json({ error: 'Fetch error' }, { status: 500 })
  }
}
