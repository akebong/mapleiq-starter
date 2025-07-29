import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function generateNegotiationText({
  vendor,
  amount,
}: {
  vendor: string
  amount: number
}) {
  const prompt = `Write a polite but firm message to negotiate a lower monthly bill with ${vendor}. The current bill is $${amount}. Make it sound professional and reasonable.`

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.7,
    max_tokens: 200,
  })

  return response.data.choices[0].text?.trim()
}
