import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '../context/Context';
import Select from 'react-select';


export default function PatientInfo() {
  const [patientInfo, setPatientInfo] = useState({
    name: 'Sam Li',
    email: 'samli@gmail.com',
    phone: '555-555-5555',
    insurance: 'Blue Cross Blue Shield',
    network: 'Medicare HMO Blue',
    policyGroupNumber: '123456',
    planIDNumber: '654321',
    homeAddress: '123 Main St, Boston, MA',
    workAddress: '456 Elm St, Boston, MA',
  });
  const [step, setStep] = useState(0);

  const { setPatientDetails } = useAppContext();
  const router = useRouter();

  const handleUseCurrentLocation = (homeOrWork) => {
    if (homeOrWork === 'home') setPatientInfo({ ...patientInfo, homeAddress: 'Getting location...' });
    else setPatientInfo({ ...patientInfo, workAddress: 'Getting location...' });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = `(${position.coords.latitude}, ${position.coords.longitude})`;
        if (homeOrWork === 'home') setPatientInfo({ ...patientInfo, homeAddress: coords });
        else setPatientInfo({ ...patientInfo, workAddress: coords });
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
        body: JSON.stringify({ text: patientInfo.patientRequest }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPatientInfo({ ...patientInfo, doctorType: data.doctorType });
      setStep(2);
    } catch (error) {
      console.error('There was an error fetching the doctor type recommendation:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const patientProfile = { ...patientInfo };
    setPatientDetails(patientProfile);
    router.push('/doctor');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {step === 0 && 'Your insurance information'}
          {step === 1 && 'Describe Your Medical Needs'}
          {step === 2 && 'Your deadlines'}
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {
            step == 0 && (
              <div>
                <div className='mt-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={
                      patientInfo.name
                    }
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                    className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                  />
                </div>
                <div className='mt-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    placeholder="Email"
                    value={
                      patientInfo.email
                    }
                    onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                    className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                  />
                </div>

                <div className='mt-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={
                      patientInfo.phone
                    }
                    onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                    className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                  />
                </div>


                <div className='mt-4'>
                  <Select
                    options={[
                      { value: 'Aetna', label: 'Aetna' },
                      { value: 'Blue Cross Blue Shield', label: 'Blue Cross Blue Shield' },
                      { value: 'Cigna', label: 'Cigna' },
                      { value: 'UnitedHealthcare', label: 'UnitedHealthcare' },
                    ]}
                    placeholder="Select your insurance provider"
                    onChange={(selectedOption) => setPatientInfo({ ...patientInfo, insurance: selectedOption.value })}
                  />
                </div>
                <div className='mt-4'>
                  <Select
                    //Medicare HMO Blue, Medicare PPO Blue, Network Blue, PPO or EPO) 
                    options={[
                      { value: 'Medicare HMO Blue', label: 'Medicare HMO Blue' },
                      { value: 'Medicare PPO Blue', label: 'Medicare PPO Blue' },
                      { value: 'Network Blue', label: 'Network Blue' },
                      { value: 'PPO or EPO', label: 'PPO or EPO' },
                    ]}
                    placeholder="Select your insurance network"
                    onChange={(selectedOption) => setPatientInfo({ ...patientInfo, network: selectedOption.value })}
                  />
                </div>

                <div className='mt-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policy Number
                  </label>
                  <input
                    type="text"
                    placeholder="Policy Group Number"
                    value={
                      patientInfo.policyGroupNumber
                    }
                    onChange={(e) => setPatientInfo({ ...patientInfo, policyGroupNumber: e.target.value })}
                    className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                  />
                </div>
                <div className='mt-4'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan ID Number
                  </label>
                  <input
                    type="text"
                    placeholder="Plan ID Number"
                    value={
                      patientInfo.planIDNumber
                    }
                    onChange={(e) => setPatientInfo({ ...patientInfo, planIDNumber: e.target.value })}
                    className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                  />
                </div>




                <div className=" mb-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Address
                  </label>
                  <div className="flex items-center">

                    <input
                      type="text"
                      placeholder="Home Address"
                      value={
                        patientInfo.homeAddress
                      }
                      onChange={(e) => setPatientInfo({ ...patientInfo, homeAddress: e.target.value })}
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
                </div>


                <div className=" mb-4 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Address
                  </label>
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      placeholder="Work Address"
                      value={
                        patientInfo.workAddress
                      }
                      onChange={(e) => setPatientInfo({ ...patientInfo, workAddress: e.target.value })}
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
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Next
                </button>
              </div>
            )
          }
          {step === 1 && (
            <>
              <textarea
                id="patientRequest"
                name="patientRequest"
                style={{ height: '200px' }}
                placeholder="Please describe your medical needs. Include any symptoms you're experiencing, how long you've been experiencing them, and any other relevant information."
                value={
                  patientInfo.patientRequest
                }
                onChange={(e) => setPatientInfo({ ...patientInfo, patientRequest: e.target.value })}
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
          )
          }

          {
            step === 2 &&
            (
              <>
                {patientInfo.doctorType && (
                  <div className="mb-4">
                    We recommend you see a <strong>{patientInfo.doctorType}</strong> based on your medical needs.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What date do you need to see a doctor by?
                  </label>

                  <input
                    type="date"
                    value={
                      patientInfo.deadline
                    }
                    onChange={(e) => setPatientInfo({ ...patientInfo, deadline: e.target.value })}
                    className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                  />
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
