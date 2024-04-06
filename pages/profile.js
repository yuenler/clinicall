import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import InsurancePageUploader from '../components/InsurancePageUploader';
import { useAppContext } from '../context/Context';

export default function PatientInfo() {
  const [homeAddress, setHomeAddress] = useState(null);
  const [workAddress, setWorkAddress] = useState(null);
  const [patientRequest, setPatientRequest] = useState('');
  const [step, setStep] = useState(1); // New state variable to manage the step
  const [doctorType, setDoctorType] = useState(null); // State variable to hold the doctor's state

  const { setWebsiteData, setPatientDetails } = useAppContext();
  const router = useRouter();

  const onUploadComplete = (data) => {
    setWebsiteData(data);
  };

  const handleUseCurrentLocation = () => {
    // Placeholder function
  };

  // New function to handle fetching doctor type recommendation
  const fetchDoctorRecommendation = async () => {
    try {
      const response = await fetch('/api/doctor-type-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as needed
        },
        body: JSON.stringify({ text: patientRequest }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDoctorType(data.doctorType); // Update doctorState with the response
      setStep(2); // Move to the next step
    } catch (error) {
      console.error('There was an error fetching the doctor type recommendation:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const patientProfile = {
      homeAddress: homeAddress ? homeAddress.value : '',
      workAddress: workAddress ? workAddress.value : '',
      patientRequest,
      // Consider including doctorState in patientProfile if needed
    };
    setPatientDetails(patientProfile);
    router.push('/findBestDoctor');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 1 ? 'Describe Your Medical Needs' : 'Enter Your Medical Information'}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <textarea
                id="patientRequest"
                name="patientRequest"
                placeholder="Describe your symptoms, preferred doctor, or anything else."
                value={patientRequest}
                onChange={(e) => setPatientRequest(e.target.value)}
                className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={fetchDoctorRecommendation}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Next
              </button>
            </>
          ) : (
            <>
              {
                doctorType && (
                  <div className="mb-4">
                    We recommend you see a <strong>{doctorType}</strong> based on your medical needs.
                  </div>
                )
              }
              <InsurancePageUploader onUploadComplete={onUploadComplete} />
              <Select
                options={[]} // Populate this array dynamically
                onChange={setHomeAddress}
                placeholder="Select Home Address"
                isClearable
                className="mb-4"
              />
              <Select
                options={[]} // Populate this array dynamically
                onChange={setWorkAddress}
                placeholder="Select Work Address"
                isClearable
                className="mb-4"
              />
              <button
                type="button"
                className="mb-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                onClick={handleUseCurrentLocation}
              >
                Use Current Location
              </button>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-blue-200 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
              >
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
