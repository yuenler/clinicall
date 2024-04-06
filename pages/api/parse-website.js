// pages/api/parse-pdf.js
import 'dotenv/config'
import { IncomingForm } from 'formidable';
import OpenAI from 'openai';
import fs from 'fs';
import pdfParse from 'pdf-parse';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) return reject(err);
      const filePath = files.file[0].filepath;
      try {

        const fileBuffer = fs.readFileSync(filePath); // Read the file into a buffer
        pdfParse(fileBuffer).then(async function (data) {
          // Here you would typically parse the PDF content to extract text
          // For demonstration, assume `fileContent` is directly usable or has been converted to text
          console.log('Parsed file content:', data.text);
          const response = await openai.chat.completions.create({
            messages: [{
              role: 'user', content: `
              Given this information about doctors available, please parse the data and return it as a JSON list.

              Example:
              [
                {
                  "name": "Dr. Smith",
                  "specialty": "Cardiology",
                  "location": "123 Main St",
                  "phone": "123-456-7890",
                  "otherInfo": "Additional information here"
                },
                {
                  "name": "Dr. Johnson",
                  "specialty": "Dermatology",
                  "location": "456 Elm St",
                  "phone": "234-567-8901",
                  "otherInfo": "Additional information here"
                }
              ]
              
              Information to parse:
            
            ${data.text}`
            }],
            model: 'gpt-4-0125-preview',
          });
          const responseText = response.choices[0].message.content
          console.log('OpenAI response:', responseText);
          // parse response for first and last bracket
          const firstBracketIndex = responseText.indexOf('[');
          const lastBracketIndex = responseText.lastIndexOf(']');
          const jsonContent = responseText.slice(firstBracketIndex, lastBracketIndex + 1);
          // convert to JSON
          const json = JSON.parse(jsonContent);
          resolve(json);
        });
      } catch (error) {
        reject(error);
      }
    });
  });

  res.status(200).json(data);
}
