
function FinalResultsModal({ onClose, callResults, isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center"
        style={{ maxWidth: '400px', width: '90%' }}>

        {callResults.length > 0 && (
          <div>

            {callResults.map((result, index) => (
              <div key={index}>
                {result.booked === true && (
                  <p className="text-green-600 mb-2 font-semibold">
                    Appointment booked at {result.appointmentTime} with {result.name}.
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

        <button
          className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded transition duration-150 ease-in-out"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default FinalResultsModal;
