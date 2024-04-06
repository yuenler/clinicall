import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7pAo4v2CaDrpJIpU7pp0TwYwIBLLhZBI",
  authDomain: "patient-booker.firebaseapp.com",
  projectId: "patient-booker",
  storageBucket: "patient-booker.appspot.com",
  messagingSenderId: "1098197640491",
  appId: "1:1098197640491:web:edbf0b08d52ee67d34516e",
  measurementId: "G-ESHVSS6SGG"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

export default function Home() {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User signed in', user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const token = result.user.accessToken;
        fetchCalendarData(token);
      }).catch((error) => {
        console.error(error);
      });
  };

  const fetchCalendarData = (accessToken) => {
    console.log('Access token:', accessToken);
    const headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Here you can redirect or do something with the calendar data
        router.push('/profile'); // Or handle the calendar data as needed
      })
      .catch((error) => {
        console.error('Error fetching calendar data:', error);
      });
  };
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
