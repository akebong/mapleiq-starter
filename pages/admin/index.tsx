import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

type ExportLog = {
  id: string
  type: string
  record_count: number
  created_at: string
}

export default function AdminPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session])

  const [status, setStatus] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [logs, setLogs] = useState<ExportLog[]>([])

  const fetchLogs = async () => {
    const res = await fetch('/api/export-logs')
    const data = await res.json()
    setLogs(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const downloadExport = async (type: 'rental' | 'utilities') => {
    setDownloading(true)
    setStatus(`Exporting ${type} data...`)

    try {
      const res = await fetch(`/api/export-${type}`)
      if (!res.ok) throw new Error(`Failed to download ${type} export`)

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${type}-metro2.txt`
      document.body.appendChild(link)
      link.click()
      link.remove()

      setStatus(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} export downloaded!`)
      fetchLogs()
    } catch (err) {
      setStatus(`❌ Failed to export ${type}`)
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  if (!session) return null

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>🛠 MapleIQ Metro2 Exports</h1>

      <button
        onClick={handleLogout}
        style={{
          marginBottom: 20,
          backgroundColor: '#f44336',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <button
        onClick={() => downloadExport('rental')}
        disabled={downloading}
        style={{
          backgroundColor: '#111',
          color: 'white',
          fontSize: 16,
          padding: '10px 20px',
          borderRadius: 6,
          cursor: 'pointer',
          marginTop: 20,
          marginRight: 10,
        }}
      >
        {downloading ? 'Exporting...' : 'Download Metro2 Rental File'}
      </button>

      <button
        onClick={() => downloadExport('utilities')}
        disabled={downloading}
        style={{
          backgroundColor: '#333',
          color: 'white',
          fontSize: 16,
          padding: '10px 20px',
          borderRadius: 6,
          cursor: 'pointer',
          marginTop: 20,
        }}
      >
        {downloading ? 'Exporting...' : 'Download Metro2 Utilities File'}
      </button>

      <p style={{ marginTop: 20 }}>{status}</p>

      <h2 style={{ marginTop: 40 }}>📋 Export Log</h2>
      <table style={{ marginTop: 10, borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th align="left">Type</th>
            <th align="left">Record Count</th>
            <th align="left">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.type}</td>
              <td>{log.record_count}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
