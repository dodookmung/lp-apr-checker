'use client'

import { useState } from 'react'

export default function Home() {
  const [token, setToken] = useState('')
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAPR = async () => {
    setLoading(true)
    setError(null)
    setPools([])

    try {
      const res = await fetch(`/api/pools?token=${token}`)
      const data = await res.json()

      if (res.ok) {
        setPools(data.pools || [])
      } else {
        setError(data.error || '서버 오류')
      }
    } catch (err) {
      setError('API 호출 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Solana LP APR 계산기</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border rounded p-2 w-full"
          placeholder="토큰 주소 입력 (예: 3pnqNz...)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          onClick={fetchAPR}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          {loading ? '계산중...' : '계산'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {pools.length > 0 && (
        <div className="space-y-4">
          {pools.map((pool, i) => (
            <div key={i} className="border rounded p-4 shadow">
              <div className="text-xl font-semibold mb-1">{pool.name}</div>
              <p>🧬 DEX: <span className="font-medium">{pool.dex}</span></p>
              <p>💧 유동성: ${Number(pool.liquidity_usd).toLocaleString()}</p>
              <p>📈 24H 거래량: ${Number(pool.volume_usd_24h).toLocaleString()}</p>
              <p className="font-bold text-green-600">🔥 APR: {pool.apr}%</p>
            </div>
          ))}
        </div>
      )}

      {/* 안내 문구 */}
      <p className="text-xs text-gray-500 mt-8 text-center">
        ※ 본 데이터는{' '}
        <a href="https://dexscreener.com" target="_blank" className="underline hover:text-blue-600">
          Dexscreener
        </a>{' '}
        API를 기반으로 하며, APR은 PumpSwap 기준 <br></br>총 수수료율 0.30% : (LP 0.20% + 프로토콜 0.05% + 크리에이터 0.05%) 기준으로 계산됩니다.
      </p>
    </main>
  )
}
