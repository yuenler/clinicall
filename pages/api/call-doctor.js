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

  const { doctorName, patientDetails, userCalendar } = req.body;



  const data = await new Promise(async (resolve, reject) => {
    try {
      const params = new URLSearchParams({
        phone_number: '+18472121849',
        port: 8080,
        start_ngrok: false,
        remote_host: 'localhost',
        doctorName,
        patientName: patientDetails.name,
        userCalendar: JSON.stringify(userCalendar),
        insuranceName: patientDetails.insurance,
        patientSymptoms: patientDetails.patientRequest,
        deadline: patientDetails.deadline,
      });

      console.log(params.toString());

      // Construct the full URL with parameters
      const url = `http://35.202.155.74/robocall?${params.toString()}`;

      // Use fetch to perform the GET request
      const response = await fetch(url);

      // Parse the JSON response
      const data = await response.json();
      resolve(data);

    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

  res.status(200).json(data);
}

