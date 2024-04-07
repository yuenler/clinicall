import { useEffect } from "react";
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";
import { useAppContext } from '../context/Context';
import icon from '../public/icon.png';
import Image from 'next/image';


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
  localStorage.setItem("google_tokens", JSON.stringify(data.token));
  return data.events;
}

export default function Home() {

  const { setUserCalendar } = useAppContext();

  const router = useRouter();

  useEffect(async () => {
    const user_tokens = localStorage.getItem("google_tokens");
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
        console.log(calendarEvents);
        setUserCalendar(calendarEvents);
      },
    });
    await client.requestCode();

    router.push("/profile");
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-teal-500 flex items-center justify-center">
      <div className="transition duration-300 ease-in-out transform hover:scale-105 max-w-md w-full bg-white shadow-2xl rounded-lg p-8">
        <div className="text-center">
          <div className="mb-8">
            <Image src={icon} alt="icon" width={300} height={300} />
          </div>
          <p className="text-xl mb-8 font-bold" style={{ fontFamily: 'Arial, sans-serif' }}>
            Find a doctor and book an appointment automatically with AI.
          </p>
          <button
            onClick={handleSignIn}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Sign up with Google
          </button>
        </div>
      </div>
    </div>

  );

}
