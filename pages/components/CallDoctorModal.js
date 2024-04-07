import { useEffect, useState } from 'react';

function CallDoctorModal({ doctor, onCancel, onClose, isVisible, timer, callResults, activelyCalling }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center"
        style={{ maxWidth: '400px', width: '90%' }}>
        <h2 className="text-indigo-800 font-semibold text-xl mb-4">{doctor.name}</h2>

        {timer > 0 && (
          <p className="text-green-600 mb-2 font-semibold">Calling in {timer}...</p>
        )}

        {activelyCalling && (
          <p className="text-red-500 mb-2 font-semibold">Call ongoing...</p>
        )}

        {callResults.length > 0 && (
          <div>
            <h2
              className='text-indigo-800 font-semibold text-lg mb-2 mt-4'
            >Call results:</h2>
            {callResults.map((result, index) => (
              <div key={index}>
                {result.booked === true && (
                  <p className="text-green-600 mb-2 font-semibold">
                    Appointment booked at {result.appointmentDate} at {result.appointmentTime} with {result.name}.
                  </p>
                )}
                {result.booked === false && (
                  <p className="text-red-500 mb-2 font-semibold">
                    Unable to book appointment with {result.name}.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className='flex items-center gap-2'>
          <button
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition duration-150 ease-in-out"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition duration-150 ease-in-out"
            onClick={onCancel}
          >
            Cancel Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallDoctorModal;
