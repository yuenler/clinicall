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

      const ratings = []

      // iterate through each doctor in the insurance data and check their reviews on google
      for (const doctor of insurance) {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${doctor.name}&key=${process.env.GOOGLE_API_KEY}`);
        const data = await response.json();
        if (data.results.length > 0) {
          const rating = data.results[0].rating;
          ratings.push(rating);
        }
        else {
          ratings.push(0);
        }
      }
      // const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=pinocchios& key=${process.env.GOOGLE_API_KEY} `);
      // console.log((await response.json()));

      // sort the doctors by their rating, and add the rating to the doctor object
      const sortedDoctors = insurance.map((doctor, index) => {
        return {
          ...doctor,
          rating: ratings[index]
        }
      }).sort((a, b) => b.rating - a.rating);

      // get top 10 doctors

      resolve(sortedDoctors.slice(0, 5));

    } catch (error) {
      reject(error);
    }
  });

  res.status(200).json(data);
}

