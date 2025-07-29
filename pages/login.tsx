import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '@supabase/auth-helpers-react'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const session = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const allowedEmails = ['udowoima@mapleiq.org'] // ✅ Replace this with your authorized admin email

  const handleLogin = async () => {
    if (!allowedEmails.includes(email.toLowerCase())) {
      setStatus('❌ This email is not authorized to access the admin panel.')
      return
    }

    setStatus('Sending magic link...')
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setStatus('❌ Failed to send login link.')
      console.error(error)
    } else {
      setStatus('✅ Check your email for the magic login link.')
    }
  }

  if (session) {
    router.push('/admin')
    return null
  }

  return (
    <div style={{ padding: 40, fontFamily: 'Arial', maxWidth: 400 }}>
      <h1>🔐 Admin Login</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <button
        onClick={handleLogin}
        style={{ width: '100%', padding: 10, backgroundColor: '#111', color: 'white', borderRadius: 6 }}
      >
        Send Magic Link
      </button>

      <p style={{ marginTop: 12 }}>{status}</p>
    </div>
  )
}
