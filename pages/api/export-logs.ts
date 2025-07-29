// pages/api/export-logs.ts

import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('metro2_exports')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error })
  res.status(200).json(data)
}
