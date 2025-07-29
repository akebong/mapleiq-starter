import { generateMetro2TextFromUtilities } from '../../lib/metro2'
import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const txt = await generateMetro2TextFromUtilities()

  // Count lines (excluding header + trailer)
  const lineCount = txt.split('\n').filter((line) =>
    line.startsWith('0426') && !line.includes('HEADER') && !line.includes('TRAILER')
  ).length

  await supabase.from('metro2_exports').insert([
    {
      type: 'utilities',
      record_count: lineCount,
      generated_by: 'admin'
    }
  ])

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Disposition', 'attachment; filename=utilities-metro2.txt')
  res.send(txt)
}
