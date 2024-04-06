import { useEffect, useState } from 'react';
import { useAppContext } from '../context/Context';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Function to help reorder the list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
function CallDoctorModal({ doctor, onCancel, isVisible, timer, userAvailability, callResults }) {
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

        {userAvailability.length > 0 ? (
          <>
            <p className="text-sm text-gray-600 mb-2">Please verify that your availability is accurate before proceeding.</p>
            <div className="bg-indigo-50 p-4 rounded-lg mb-4 w-full">
              <p className="text-indigo-800 mb-2">Your available times:</p>
              <ul className="list-disc pl-5 text-sm">
                {userAvailability.map((availability, index) => (
                  <li key={index} className="text-gray-700">
                    {formatDate(availability.start)} - {formatDate(availability.end)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-gray-700 mb-2">Determining your availability based on your calendar and doctor's distance...</p>
        )}

        {userAvailability.length > 0 && timer > 0 && (
          <p className="text-green-600 mb-2 font-semibold">Calling in {timer}...</p>
        )}

        {userAvailability.length > 0 && timer == 0 && callResults === "" && (
          <p className="text-red-500 mb-2 font-semibold">Call ongoing...</p>
        )}

        {callResults && (
          <p className="text-red-500 mb-2">{callResults}</p>
        )}


        <button
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition duration-150 ease-in-out"
          onClick={onCancel}
        >
          Cancel Call
        </button>
      </div>
    </div>
  );
}

function FindBestDoctor() {
  const [loading, setLoading] = useState(false);
  const { websiteData, insuranceData, setInsuranceData, patientDetails } = useAppContext();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingText, setLoadingText] = useState('Searching for doctors...');
  const [filter, setFilter] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDoctorBeingCalled, setCurrentDoctorBeingCalled] = useState(null);
  const [userAvailability, setUserAvailability] = useState([]);
  const [timer, setTimer] = useState(10);
  const [callResults, setCallResults] = useState('')



  const cancelCall = () => {
    setIsModalVisible(false);
  };

  const router = useRouter();

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      selectedDoctors,
      result.source.index,
      result.destination.index
    );
    setSelectedDoctors(items);
  };

  useEffect(() => {
    if (!websiteData) {
      router.push('/profile');
      return;
    }
    setLoading(true);
    setLoadingText('Searching for ' + patientDetails.doctorType + 's...');

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

  const addDoctorToCallList = (doctor) => {
    setSelectedDoctors(prev => [...prev, doctor]);
  };

  const removeDoctorFromCallList = (doctorIndex) => {
    setSelectedDoctors(prev => prev.filter((_, index) => index !== doctorIndex));
  };

  // function to call all doctors in the list in order here
  const callDoctors = async () => {
    for (let i = 0; i < selectedDoctors.length; i++) {
      setTimer(10);
      setUserAvailability([]);
      setCallResults('');
      await handleCallDoctor(selectedDoctors[i]);
    }
  };

  const handleCallDoctor = async (doctor) => {
    setCurrentDoctorBeingCalled(doctor);
    setIsModalVisible(true);

    // wait 5 seconds to simulate getting user availability

    await new Promise((resolve) => setTimeout(resolve, 5000));
    setUserAvailability([
      { start: '2024-10-01T09:00:00', end: '2024-10-01T10:00:00' },
      { start: '2024-10-01T11:00:00', end: '2024-10-01T12:00:00' },
    ]);

    // wait 10 seconds to give user time to cancel the call, update timer

    for (let i = 0; i < 10; i++) {

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimer((currentTimer) => currentTimer - 1);
    }

    // wait 10 seconds to simulate the call
    await new Promise((resolve) => setTimeout(resolve, 10000));

    setCallResults('Unable to book an appointment with ' + doctor.name + '. Moving on to the next doctor...');

    // wait 5 seconds to simulate a delay before moving on to the next doctor
    await new Promise((resolve) => setTimeout(resolve, 5000));

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
            There are a lot of {patientDetails.doctorType ? patientDetails.doctorType.toLowerCase() : 'doctor'}s in your area to choose from! Would you like me to do some research on them to filter it down to just a few?
          </div>
          <div>
            <textarea
              id="filter"
              name="filter"
              placeholder="How would you like me to filter the doctors? (e.g. 'I want doctors with high ratings, went to top medical schools, Asian, and handle contact lenses.')"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <button
              className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-2'
              onClick={() => filterDoctors()}
            >
              Research doctors and filter them down for me
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Doctors to Call</h2>
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
          style={{ maxWidth: '1000px' }}
        >
          <p>
            Here are the doctors you've selected to call. You can drag and drop to reorder them. I will call them in the order you've selected, and will only move on to the next doctor only if I am unable to book an appointment with the current one.
            I will be using your calendar to schedule appointments (I will take into account travel time), so please make sure it is up to date.

          </p>
        </div>
        {
          selectedDoctors.length === 0 && (
            <p className="text-gray-500">You haven't selected any doctors yet.</p>
          )
        }
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex space-x-2 overflow-x-auto">
                {selectedDoctors.map((doctor, index) => (
                  <Draggable key={doctor.name} draggableId={doctor.name} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border rounded-lg p-4 shadow-md flex items-center justify-between"
                        style={{ minWidth: '300px', ...provided.draggableProps.style }}
                      >
                        <div className="flex items-center">
                          <span className="font-bold mr-2">{index + 1}.</span> {/* Numbering each card */}
                          <div>
                            <h3>{doctor.name}</h3>
                            <p>{doctor.phone}</p>
                          </div>
                        </div>
                        <button
                          className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 rounded"
                          onClick={() => removeDoctorFromCallList(index)}
                        >
                          -
                        </button>
                      </div>

                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mt-4" onClick={callDoctors}>Call Doctors</button>
      </div>


      <div className="mt-8"
        style={{ maxWidth: '1000px' }}
      >
        <h2 className="text-lg font-semibold mb-4">Doctors in Your Area</h2>
        <div className="flex flex-wrap -m-2">
          {insuranceData && insuranceData.length > 0 && insuranceData.map((doctor, index) => (
            <div key={index} className="p-2 flex-auto">
              <div className="border rounded-lg p-4 shadow-md flex flex-col">
                <h2 className="text-lg font-semibold">{doctor.name}</h2>
                <p>Specialty: {doctor.specialty}</p>
                <p>Location: {doctor.location}</p>
                <p>Phone: {doctor.phone}</p>
                <p>{doctor.otherInfo}</p>
                {selectedDoctors.find(selectedDoctor => selectedDoctor.name === doctor.name) ? (
                  <button
                    className="mt-3 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded self-start"
                    onClick={() => removeDoctorFromCallList(selectedDoctors.findIndex(selectedDoctor => selectedDoctor.name === doctor.name))}>-</button>
                ) : (
                  <button
                    className="mt-3 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded self-start"
                    onClick={() => addDoctorToCallList(doctor)}>+</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CallDoctorModal
        doctor={currentDoctorBeingCalled}
        onCancel={cancelCall}
        isVisible={isModalVisible}
        timer={timer}
        userAvailability={userAvailability}
        callResults={callResults}
      />
    </div >
  );
}


export default FindBestDoctor
