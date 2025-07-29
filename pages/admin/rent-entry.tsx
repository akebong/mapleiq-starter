import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function RentEntryPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    sin: '',
    rent_amount: '',
    payment_date: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
  })

  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setStatus('')
    setLoading(true)

    const { error } = await supabase.from('rent_reports').insert([
      {
        ...form,
        rent_amount: parseFloat(form.rent_amount),
        user_id: session?.user?.id || '', // Supabase-authenticated user
      },
    ])

    if (error) {
      console.error(error)
      setStatus('❌ Failed to submit. Please try again.')
    } else {
      setStatus('✅ Rent report submitted successfully!')
      setForm({
        first_name: '',
        last_name: '',
        sin: '',
        rent_amount: '',
        payment_date: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        province: '',
        postal_code: '',
      })
      setTimeout(() => router.push('/admin'), 1500)
    }

    setLoading(false)
  }

  if (!session) return null

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>📋 Add Rent Report</h1>

      {Object.entries(form).map(([key, val]) => (
        <input
          key={key}
          type={key === 'payment_date' ? 'date' : 'text'}
          placeholder={key.replace(/_/g, ' ')}
          value={val}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{
            display: 'block',
            marginBottom: 10,
            padding: 10,
            width: 300,
            borderRadius: 4,
            border: '1px solid #ccc',
          }}
        />
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#999' : '#111',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {status && (
        <div
          style={{
            marginTop: 16,
            padding: 10,
            backgroundColor: status.includes('❌') ? '#ffdddd' : '#ddffdd',
            border: `1px solid ${status.includes('❌') ? '#ff0000' : '#00aa00'}`,
            borderRadius: 4,
            color: '#111',
          }}
        >
          {status}
        </div>
      )}
    </div>
  )
}
