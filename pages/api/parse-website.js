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

  const doctors =
    [
      {
        "name": "Megan L Cope, OD",
        "specialty": "Optometry",
        "location": "1276 Massachusetts Avenue Cambridge, MA 02138",
        "phone": "617-868-1500",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Harvard Square Eye Care",
        "specialty": "Optometry",
        "location": "19 Dunster Street Cambridge, MA 02138",
        "phone": "617-354-5590",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Amanda K Wiederoder, OD",
        "specialty": "Optometry",
        "location": "19 Dunster Street Cambridge, MA 02138",
        "phone": "617-354-5590",
        "otherInfo": "Telehealth, In Network, Accepting New Patients"
      },
      {
        "name": "Lauren J Dickerman, OD",
        "specialty": "Optometry",
        "location": "19 Dunster Street Cambridge, MA 02138",
        "phone": "617-354-5590",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Lawrence A Phillips, OD",
        "specialty": "Optometry",
        "location": "1077 Massachusetts Avenue Cambridge, MA 02138",
        "phone": "617-547-3310",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Lunette Cambridge PC",
        "specialty": "Optometry",
        "location": "35 Brattle Street Cambridge, MA 02138",
        "phone": "617-714-6600",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Michelle F Rahimian, OD",
        "specialty": "Optometry",
        "location": "35 Brattle Street Cambridge, MA 02138",
        "phone": "617-714-6600",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Stivia Demiri, OD",
        "specialty": "Optometry",
        "location": "35 Brattle Street Cambridge, MA 02138",
        "phone": "617-714-6600",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Fotini Kostogiannis, OD",
        "specialty": "Optometry",
        "location": "One Brattle Square Suite A2 Cambridge, MA 02138",
        "phone": "617-547-6080",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Ariadne I Rowe, OD",
        "specialty": "Optometry",
        "location": "One Brattle Square Cambridge, MA 02138",
        "phone": "617-547-6080",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Tiffany Lu, OD",
        "specialty": "Optometry",
        "location": "12 Eliot Street Cambridge, MA 02138",
        "phone": "617-354-3303",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Vivek B Mallampalli, OD",
        "specialty": "Optometry",
        "location": "12 Eliot Street Cambridge, MA 02138",
        "phone": "617-354-3303",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Murray H Baumal, OD",
        "specialty": "Optometry",
        "location": "12 Eliot Street Cambridge, MA 02138",
        "phone": "617-354-3303",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Gabrielle C Nivar, OD",
        "specialty": "Optometry",
        "location": "12 Eliot Street Cambridge, MA 02138",
        "phone": "617-354-3303",
        "otherInfo": "Telehealth, In Network, Accepting New Patients"
      },
      {
        "name": "Nguyet Lesoltis, OD",
        "specialty": "Optometry",
        "location": "12 Eliot Street Cambridge, MA 02138",
        "phone": "617-354-3303",
        "otherInfo": "Telehealth, In Network, Accepting New Patients"
      },
      {
        "name": "David M Luria, OD",
        "specialty": "Optometry",
        "location": "12 Eliot Street Cambridge, MA 02138",
        "phone": "617-354-3310",
        "otherInfo": "In Network, Accepting New Patients"
      },
      {
        "name": "Samira S Mortazavi, OD",
        "specialty": "Optometry",
        "location": "1575 Cambridge Street Cambridge, MA 02138",
        "phone": "617-876-4344",
        "otherInfo": "Telehealth, In Network, Accepting New Patients"
      },
      {
        "name": "Asha Meloottu, OD",
        "specialty": "Optometry",
        "location": "1575 Cambridge Street Cambridge, MA 02138",
        "phone": "617-876-4344",
        "otherInfo": "Telehealth, In Network, Accepting New Patients"
      },
      {
        "name": "Kathleen Murphy, OD",
        "specialty": "Optometry",
        "location": "50 Prospect Street Cambridge, MA 02139",
        "phone": "617-349-3937",
        "otherInfo": "In Network, Accepting New Patients"
      }
    ]


  const { insurance, patientDetails } = req.body;


  const data = await new Promise(async (resolve, reject) => {
    try {

      // temporary response, return a random sample of 5 doctors from the insurance data
      const data = doctors;

      // wait 5 seconds to simulate a slow response
      await new Promise((resolve) => setTimeout(resolve, 2000));

      resolve(data);

    } catch (error) {
      reject(error);
    }
  });

  res.status(200).json(data);
}



