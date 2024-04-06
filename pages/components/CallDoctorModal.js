
function CallDoctorModal({ doctor, onCancel, onClose, isVisible, timer, callResults }) {
  if (!isVisible) return null;

  // Helper function to format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center"
        style={{ maxWidth: '400px', width: '90%' }}>
        <h2 className="text-indigo-800 font-semibold text-xl mb-4">{doctor.name}</h2>

        {timer > 0 && (
          <p className="text-green-600 mb-2 font-semibold">Calling in {timer}...</p>
        )}

        {timer == 0 && callResults === "" && (
          <p className="text-red-500 mb-2 font-semibold">Call ongoing...</p>
        )}

        {callResults && (
          <p className="text-red-500 mb-2">{callResults}</p>
        )}



        <div
          className='flex items-center gap-2'
        >
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
