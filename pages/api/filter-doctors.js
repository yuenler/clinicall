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

  const { insurance, patientDetails } = req.body;



  const data = await new Promise(async (resolve, reject) => {
    try {

      // temporary response, return a random sample of 5 doctors from the insurance data
      const shuffledInsuranceData = insurance.sort(() => Math.random() - 0.5);
      const data = shuffledInsuranceData.slice(0, 5);

      // wait 5 seconds to simulate a slow response
      await new Promise((resolve) => setTimeout(resolve, 5000));


      resolve(data);

    } catch (error) {
      reject(error);
    }
  });

  res.status(200).json(data);
}

