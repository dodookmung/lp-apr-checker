// app/page.tsx
'use client'

import { useState } from 'react'

export default function Home() {
  const [token, setToken] = useState('')
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAPR = async () => {
    setLoading(true)
    const res = await fetch(`/api/pools?token=${token}`)
    const data = await res.json()
    setPools(data.pools || [])
    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Solana LP APR 계산기</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded p-2 w-full"
          placeholder="토큰 주소를 입력하세요 (예: 2Xfyz...)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          onClick={fetchAPR}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          {loading ? '로딩중...' : '계산'}
        </button>
      </div>

      {pools.length > 0 && (
        <div className="space-y-4">
          {pools.map((pool, i) => (
            <div key={i} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{pool.name}</h2>
              <p>Liquidity: ${Number(pool.liquidity_usd).toLocaleString()}</p>
              <p>24H Volume: ${Number(pool.volume_usd_24h).toLocaleString()}</p>
              <p className="font-bold text-green-600">APR: {pool.apr}%</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
