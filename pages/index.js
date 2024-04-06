import { useEffect } from "react";
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";
import { useAppContext } from '../context/Context';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7pAo4v2CaDrpJIpU7pp0TwYwIBLLhZBI",
  authDomain: "patient-booker.firebaseapp.com",
  projectId: "patient-booker",
  storageBucket: "patient-booker.appspot.com",
  messagingSenderId: "1098197640491",
  appId: "1:1098197640491:web:edbf0b08d52ee67d34516e",
  measurementId: "G-ESHVSS6SGG",
};

// Initialize Firebase
initializeApp(firebaseConfig);

export async function getCalendarItems(body) {
  const res = await fetch("/api/get-cal-items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
  const data = await res.json();
  console.log(data);
  console.log("events:", data.events);
  localStorage.setItem("google_tokens", JSON.stringify(data.token));
  return data.events;
}

export default function Home() {

  const { setUserCalendar } = useAppContext();

  const router = useRouter();

  useEffect(async () => {
    const user_tokens = localStorage.getItem("google_tokens");
    console.log(user_tokens);
    if (user_tokens) {
      router.push("/profile");
      await getCalendarItems(user_tokens);
    }
  });

  const handleSignIn = async () => {
    const client = google.accounts.oauth2.initCodeClient({
      client_id:
        "1098197640491-5lrsebas4v27pphjarb2dtovh2v7674u.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/calendar.readonly",
      access_type: "offline",
      ux_mode: "popup",
      callback: async (response) => {
        // Send response.code to your backend
        const calendarEvents = await getCalendarItems(JSON.stringify({ code: response.code }));
        setUserCalendar(calendarEvents);
      },
    });
    await client.requestCode();

    router.push("/profile");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-teal-500">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Welcome to the Patient Booker.
        </h1>
        <p className="text-xl text-white mb-8">
          Book appointments with your doctor automatically with AI.
        </p>
        <button
          onClick={handleSignIn}
          className="bg-white text-gray-800 font-semibold py-2 px-4 border border-transparent rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 transition duration-150 ease-in-out"
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );

}
