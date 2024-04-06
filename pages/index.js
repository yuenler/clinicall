import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to the patient booker.
        </h1>
        <p className="text-lg text-indigo-100 mb-8">
          Book appointments with your doctor automatically with AI.
        </p>
        <button
          onClick={() => router.push('/profile')}
          className="bg-white text-indigo-600 font-semibold py-2 px-4 border border-transparent rounded-lg shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Get Booking
        </button>
      </div>
    </div>
  );
}
