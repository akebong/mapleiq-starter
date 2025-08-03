// lib/metro2.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

type RentReport = {
  full_name: string
  sin: string
  rent_amount: number
  payment_date: string
  street: string
  unit: string
  city: string
  province: string
  postal_code: string
}

type UtilityReport = {
  full_name: string
  utility_type: string
  account_number: string
  payment_amount: number
  payment_date: string
  city: string
  province: string
  postal_code: string
}

export async function generateMetro2TextFromRentalLive(): Promise<string> {
  const { data: rentData, error } = await supabase
    .from('rent_reports')
    .select('*')

  if (error || !rentData) {
    throw new Error('Failed to fetch rent data from Supabase')
  }

  const header =
    '0426HEADER V001101234 08312024100220240701202007012020COMPANY NAME 123 Anywhere Ave, Toronto, ON A1B 2C3 4161234567'

  const body = rentData
    .map((r: RentReport) => {
      const name = (r.full_name ?? '').padEnd(35)
      const sin = (r.sin ?? '').padEnd(9, '0')
      const rent = Math.round(r.rent_amount * 100).toString().padStart(10, '0')
      const date = r.payment_date.replace(/-/g, '')
      const address = `${r.street ?? ''} ${r.unit ?? ''}`.trim().padEnd(50)
      const city = (r.city ?? '').padEnd(20)
      const province = (r.province ?? '').padEnd(2)
      const postal = (r.postal_code ?? '').padEnd(7)

      return `0426${name}${sin}${rent}${date}${address}${city}${province}${postal}`
    })
    .join('\n')

  const trailer = '0426TRAILER'

  return [header, body, trailer].join('\n')
}

export async function generateMetro2TextFromUtilities(): Promise<string> {
  const { data: utilityData, error } = await supabase
    .from('utility_reports')
    .select('*')

  if (error || !utilityData) {
    throw new Error('Failed to fetch utility data from Supabase')
  }

  const header =
    '0426HEADER V001201234 08312024100220240701202007012020COMPANY NAME 123 Anywhere Ave, Toronto, ON A1B 2C3 4161234567'

  const body = utilityData
    .map((u: UtilityReport) => {
      const name = (u.full_name ?? '').padEnd(35)
      const type = (u.utility_type ?? '').padEnd(15)
      const acct = (u.account_number ?? '').padEnd(20)
      const amount = Math.round(u.payment_amount * 100).toString().padStart(10, '0')
      const date = u.payment_date.replace(/-/g, '')
      const city = (u.city ?? '').padEnd(20)
      const province = (u.province ?? '').padEnd(2)
      const postal = (u.postal_code ?? '').padEnd(7)

      return `0426${name}${type}${acct}${amount}${date}${city}${province}${postal}`
    })
    .join('\n')

  const trailer = '0426TRAILER'

  return [header, body, trailer].join('\n')
}
