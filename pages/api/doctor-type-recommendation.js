// pages/api/requirements-fulfillment.js
import 'dotenv/config'
import OpenAI from 'openai';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  const { text } = req.body;

  const data = await new Promise(async (resolve, reject) => {
    try {
      const response = await openai.chat.completions.create({
        messages: [{
          role: 'user', content: `
            Given this information, what kind of doctor should I see? Respond with only the doctor type, as a single word.
            
           Information:
          
          ${text}`
        }],
        model: 'gpt-4-0125-preview',
      });
      const responseText = response.choices[0].message.content
      console.log('OpenAI response:', responseText);

      resolve(responseText);

    } catch (error) {
      reject(error);
    }
  });

  res.status(200).json(data);
}

