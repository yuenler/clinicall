import { useEffect, useState } from 'react';
import { useAppContext } from '../context/Context';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/router';

function FindBestDoctor() {
  const [loading, setLoading] = useState(false);
  const { websiteData, insuranceData, setInsuranceData } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    const fetchRubric = async () => {
      if (!websiteData) {
        router.push('/profile');
        return;
      }
      setLoading(true);

      const formData = new FormData();
      formData.append('file', websiteData);
      const response = await fetch('/api/parse-website', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setInsuranceData(data);
      setLoading(false);
    };

    fetchRubric();
  }, [websiteData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg font-semibold mb-2">Parsing your insurance website...</p>
          <ThreeDots color="#00BFFF" height={80} width={80} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">Here's what I found from what you've uploaded:</h1>
      <div className="space-y-4">
        {insuranceData && insuranceData.map((doctor, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold">{doctor.name}</h2>
            <p>Specialty: {doctor.specialty}</p>
            <p>Location: {doctor.location}</p>
            <p>Phone: {doctor.phone}</p>
            <p>{doctor.otherInfo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindBestDoctor;
