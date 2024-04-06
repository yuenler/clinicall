import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select';
import InsurancePageUploader from '../components/InsurancePageUploader'; // Assuming you have this component ready for insurance upload
import { useAppContext } from '../context/Context';

const addressOptions = [
  // This would be dynamically generated based on the user's input or a predefined list of addresses
];

export default function PatientInfo() {
  const [homeAddress, setHomeAddress] = useState(null);
  const [workAddress, setWorkAddress] = useState(null);
  const [patientRequest, setPatientRequest] = useState('');

  const { setWebsiteData, setPatientDetails } = useAppContext();

  const router = useRouter();

  const onUploadComplete = (data) => {
    setWebsiteData(data);
  };

  const handleUseCurrentLocation = () => {
    // Implement fetching and setting of the current location here.
    // This is just a placeholder function.
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const patientProfile = {
      homeAddress: homeAddress ? homeAddress.value : '',
      workAddress: workAddress ? workAddress.value : '',
      patientRequest,
    };
    setPatientDetails(patientProfile);
    // Navigate to the next step or page
    router.push('/findBestDoctor');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Enter Your Medical Information
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <InsurancePageUploader onUploadComplete={onUploadComplete} />
          <Select
            options={addressOptions}
            onChange={setHomeAddress}
            placeholder="Select Home Address"
            isClearable
            className="mb-4"
          />
          <Select
            options={addressOptions}
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
          <textarea
            id="patientRequest"
            name="patientRequest"
            placeholder="Describe your symptoms, preferred doctor, or anything else."
            value={patientRequest}
            onChange={(e) => setPatientRequest(e.target.value)}
            className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-800 bg-blue-200 hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
