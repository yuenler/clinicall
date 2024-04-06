import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InsurancePageUploader from '../components/InsurancePageUploader';
import { useAppContext } from '../context/Context';
import Select from 'react-select';


export default function PatientInfo() {
  const [homeAddress, setHomeAddress] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [patientRequest, setPatientRequest] = useState('');
  const [step, setStep] = useState(1);
  const [doctorType, setDoctorType] = useState(null);
  const [transportType, setTransportType] = useState(null);
  const [deadline, setDeadline] = useState('');

  const { setWebsiteData, setPatientDetails } = useAppContext();
  const router = useRouter();

  const onUploadComplete = (data) => {
    setWebsiteData(data);
  };

  const handleUseCurrentLocation = (homeOrWork) => {
    if (homeOrWork === 'home') setHomeAddress('Getting location...');
    else setWorkAddress('Getting location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = `(${position.coords.latitude}, ${position.coords.longitude})`;
        if (homeOrWork === 'home') setHomeAddress(coords);
        else setWorkAddress(coords);
      }, () => {
        alert('Error getting location');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const fetchDoctorRecommendation = async () => {
    try {
      const response = await fetch('/api/doctor-type-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: patientRequest }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDoctorType(data.doctorType);
      setStep(2);
    } catch (error) {
      console.error('There was an error fetching the doctor type recommendation:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const patientProfile = {
      homeAddress,
      workAddress,
      workHours,
      transportType,
      patientRequest,
      doctorType,
      deadline,
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
                style={{ height: '200px' }}
                placeholder="Please describe your medical needs. Include any symptoms you're experiencing, how long you've been experiencing them, and any other relevant information."
                value={patientRequest}
                onChange={(e) => setPatientRequest(e.target.value)}
                className="p-5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
              {doctorType && (
                <div className="mb-4">
                  We recommend you see a <strong>{doctorType}</strong> based on your medical needs.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What date do you need to see a doctor by?
                </label>

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                />
              </div>

              <div className="flex items-center mb-4">



                <input
                  type="text"
                  placeholder="Home Address"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                />
                <button
                  type="button"
                  onClick={() => handleUseCurrentLocation('home')}
                  className="p-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  style={{ marginLeft: "-1px" }} // This helps visually connect the button to the input
                >
                  <svg className="w-6 h-</div>6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C8.13401 2 5 5.13401 5 9c0 5 7 13 7 13s7-8 7-13c0-3.866-3.134-7-7-7z" />
                    <circle cx="12" cy="9" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </button>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  When do you work? (Example response: Mon-Thurs 9-5, but I leave early at 3 on Fridays)
                </label>

                <input
                  type="text"
                  placeholder="Work hours"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How do you get to work?
                </label>

                <Select
                  options={[
                    { value: 'car', label: 'Car' },
                    { value: 'publicTransport', label: 'Public Transport' },
                    { value: 'bike', label: 'Bike' },
                    { value: 'walk', label: 'Walk' },
                  ]}
                  onChange={(selectedOption) => {
                    setTransportType(selectedOption.value);
                  }}
                  placeholder="Select a transport type"
                  isClearable
                  isSearchable
                />
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="text"
                  placeholder="Work Address"
                  value={workAddress}
                  onChange={(e) => setWorkAddress(e.target.value)}
                  className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                />
                <button
                  type="button"
                  onClick={() => handleUseCurrentLocation('work')}
                  className="p-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  style={{ marginLeft: "-1px" }} // This helps visually connect the button to the input
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C8.13401 2 5 5.13401 5 9c0 5 7 13 7 13s7-8 7-13c0-3.866-3.134-7-7-7z" />
                    <circle cx="12" cy="9" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>

                </button>
              </div>

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
