console.log('Resolved CWD:', process.cwd())
console.log('Resolved PATH test:', require('fs').existsSync(require('path').resolve(__dirname, '../../lib/metro2.ts')))

import { generateMetro2TextFromRentalLive } from '../../../lib/metro2'
import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const txt = await generateMetro2TextFromRentalLive()

  // Count how many records were exported
  const lineCount = txt.split('\n').filter((line) => line.startsWith('0426') && !line.includes('HEADER') && !line.includes('TRAILER')).length

  // Log export
  await supabase.from('metro2_exports').insert([
    {
      type: 'rental',
      record_count: lineCount,
      generated_by: 'admin' // Replace with email or user_id when auth is added
    }
  ])

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Disposition', 'attachment; filename=metro2.txt')
  res.send(txt)
}
