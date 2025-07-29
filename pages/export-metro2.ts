import { generateMetro2Text } from '../../lib/metro2'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dummyReports = [
    {
      user_id: '12345678',
      rent_amount: 1200,
      payment_date: '2025-07-01',
      proof_url: 'https://fakeurl.com/image.jpg',
    },
    {
      user_id: '87654321',
      rent_amount: 950,
      payment_date: '2025-07-01',
      proof_url: 'https://fakeurl.com/image2.jpg',
    },
  ]

  const txt = generateMetro2Text(dummyReports)

  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Disposition', 'attachment; filename=metro2.txt')
  res.send(txt)
}
