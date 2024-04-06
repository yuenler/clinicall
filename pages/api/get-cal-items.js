import { google } from "googleapis";

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  return events.map((event, i) => {
    return {
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      summary: event.summary,
    };
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let tokens = null;
  const auth = new google.auth.OAuth2(
    "1098197640491-5lrsebas4v27pphjarb2dtovh2v7674u.apps.googleusercontent.com",
    "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",
    "postmessage"
  );
  if (req.body.hasOwnProperty("code")) {
    const { code } = req.body;

    tokens = (await auth.getToken(code)).tokens;
  } else {
    tokens = req.body;
  }
  auth.setCredentials(tokens);

  let events = await listEvents(auth);

  res.status(200).json({ events: events, token: tokens });
}
