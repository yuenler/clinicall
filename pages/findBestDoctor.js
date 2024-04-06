import { useEffect, useState } from 'react';
import { useAppContext } from '../context/Context';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/router';

function FindBestDoctor() {
  const [loading, setLoading] = useState(false);
  const { websiteData, insuranceData, setInsuranceData, patientDetails } = useAppContext();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingText, setLoadingText] = useState('Parsing your insurance website...');

  const router = useRouter();

  useEffect(() => {
    if (!websiteData) {
      router.push('/profile');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', websiteData);
    const fetchData = async () => {
      const response = await fetch('/api/parse-website', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setInsuranceData(data);
      setLoading(false);

      // Check if doctors exceed 10 to show alert
      if (data.length > 10) {
        setShowAlert(true);
      }
    };

    fetchData();
  }, [websiteData]);

  const handleCallDoctor = async (doctor) => {
    const response = await fetch('/api/call-doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: doctor.phone,
        insurance: insuranceData,
        patientRequest: patientDetails.patientRequest,
      }),
    });

    // Handle response here, e.g., show a success message
  };

  const filterDoctors = async () => {
    setLoadingText('Filtering down to the best doctors for you...');
    setLoading(true);
    const response = await fetch('/api/filter-doctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        insurance: insuranceData,
        patientDetails,
      }),
    });

    const data = await response.json();
    setInsuranceData(data);
    setLoading(false);
    setShowAlert(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg font-semibold mb-2">{loadingText}</p>
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">

      {showAlert && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-5" role="alert"
        >
          <div>
            It looks like you've provided a lot of doctors to choose from! Would you like me to do some research on them to filter it down to just a few?
          </div>
          <div>
            <button
              className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-2'
              onClick={() => filterDoctors()}
            >
              Research doctors and filter them down for me
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {insuranceData && insuranceData.length > 0 && insuranceData.map((doctor, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold">{doctor.name}</h2>
            <p>Specialty: {doctor.specialty}</p>
            <p>Location: {doctor.location}</p>
            <p>Phone: {doctor.phone}</p>
            <p>{doctor.otherInfo}</p>
            <button
              className="mt-3 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleCallDoctor(doctor)}>Call them for me</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindBestDoctor;
