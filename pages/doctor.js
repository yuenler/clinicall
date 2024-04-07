import { useEffect, useState } from 'react';
import { useAppContext } from '../context/Context';
import { ThreeDots } from 'react-loader-spinner';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiInfo, FiPhoneCall, FiStar } from 'react-icons/fi'; // Importing an info icon from react-icons
import CallDoctorModal from './components/CallDoctorModal';
import FilterDoctorsCard from './components/FilterDoctorsCard';
import FinalResultsModal from './components/FinalResultsModal';
import { FaStar } from 'react-icons/fa'; // Importing a star icon from react-icons

// Function to help reorder the list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function FindBestDoctor() {
  const [loading, setLoading] = useState(false);
  const { websiteData, insuranceData, setInsuranceData, patientDetails } = useAppContext();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingText, setLoadingText] = useState('Searching for doctors...');
  const [filter, setFilter] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDoctorBeingCalled, setCurrentDoctorBeingCalled] = useState(null);
  const [timer, setTimer] = useState(10);
  const [callResults, setCallResults] = useState([])
  const [isHovering, setIsHovering] = useState(false);
  const [transportType, setTransportType] = useState(null);
  const [travelTime, setTravelTime] = useState(null);
  const [calling, setCalling] = useState(false);
  const [activelyCalling, setActivelyCalling] = useState(false);
  const [displayFinalResultsModal, setDisplayFinalResultsModal] = useState(false);

  const cancelCall = () => {
    const confirmation = confirm('Are you sure you want to cancel the call? This will hang up on the current doctor office it is calling.');
    if (!confirmation) return;

    setIsModalVisible(false);
    setCalling(false);
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
    setLoadingText(`Searching for ${patientDetails.doctorType ?? 'doctor'}s...`);

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
    if (selectedDoctors.length === 0) {
      alert('Please select doctors to call.');
      return;
    }
    setCalling(true);
    const cResults = []
    for (let i = 0; i < selectedDoctors.length; i++) {
      setTimer(10);
      const results = await handleCallDoctor(selectedDoctors[i], i === selectedDoctors.length - 1);
      cResults.push(results);
      setCallResults([...cResults]);
    }
  };

  const handleCallDoctor = async (doctor, isLast) => {
    setCurrentDoctorBeingCalled(doctor);


    // wait 10 seconds to give user time to cancel the call, update timer
    for (let i = 0; i < 10; i++) {

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimer((currentTimer) => currentTimer - 1);
    }


    setActivelyCalling(true);
    // wait 10 seconds to simulate the call
    await new Promise((resolve) => setTimeout(resolve, 10000));

    setActivelyCalling(false);


    let results;
    if (isLast) {
      // set call results to be the information of the doctor
      results = {
        name: doctor.name,
        phone: doctor.phone,
        booked: true,
        appointmentDate: 'Monday, August 23, 2021',
        appointmentTime: '10:00 AM',
      }
      setCalling(false);
      setDisplayFinalResultsModal(true);
    } else {
      // set call results to be the information of the doctor
      results = {
        name: doctor.name,
        phone: doctor.phone,
        booked: false,
      }
    }

    return results;

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
        <FilterDoctorsCard
          onFilterDoctors={filterDoctors} // Assuming filterDoctors is your function to apply filters
          onTransportTypeChange={(selectedOption) => setTransportType(selectedOption)}
          onTravelTimeChange={(selectedOption) => setTravelTime(selectedOption)}
          onFilterChange={(e) => setFilter(e.target.value)}
          transportType={transportType}
          travelTime={travelTime}
          filter={filter}
        />
      )}

      <div className="mt-8">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold mb-4">{patientDetails.doctorType ?? 'Doctor'}s to Call</h2>
          <div
            onClick={() => setIsHovering(!isHovering)}
            className="cursor-pointer"
          >
            <FiInfo
              // color
              color={isHovering ? 'blue' : 'gray'}
            /> {/* This is the question mark icon */}
          </div>
        </div>
        {isHovering && (
          <div
            className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
            style={{ maxWidth: '1000px' }}
          >
            <p>
              Here are the doctors you've selected to call. You can drag and drop to reorder them. I will call them in the order you've selected, and will only move on to the next doctor only if I am unable to book an appointment with the current one.
              I will be using your calendar to schedule appointments (I will take into account travel time), so please make sure it is up to date.
            </p>
          </div>
        )}
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
        {!calling ?
          <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mt-4" onClick={callDoctors}>Call Doctors</button>
          :
          <div
            className='flex items-center gap-2 bg-gray-100 p-4 rounded-lg shadow-md mt-4 cursor-pointer'
          >
            <div className='mr-5'>
              <p className="text-lg font-semibold mb-2">Calling...</p>
            </div>
            <button
              onClick={() => setIsModalVisible(true)}
              className='text-white font-bold py-2 px-4 rounded bg-gray-500 hover:bg-gray-400 transition duration-150 ease-in-out flex items-center justify-center'
            >
              <span className="flex items-center">View Call Status
                <FiPhoneCall
                  className="text-green-500 ml-2" // Added margin-left for spacing
                  size={24}
                />
              </span>
            </button>

            <button
              className='text-white font-bold py-2 px-4 rounded bg-red-500 hover:bg-red-400 transition duration-150 ease-in-out flex items-center justify-center'
              onClick={() => cancelCall()}
            >
              Cancel Call
            </button>

          </div>

        }

      </div>


      <div className="mt-8"
        style={{ maxWidth: '1000px' }}
      >
        <h2 className="text-lg font-semibold mb-4">{patientDetails.doctorType ?? 'Doctor'}s in Your Area</h2>
        <div className="flex flex-wrap -m-2">
          {insuranceData && insuranceData.length > 0 && insuranceData.map((doctor, index) => (
            <div key={index} className="p-2 flex-auto">
              <div className="border rounded-lg p-4 shadow-md flex flex-col">
                <h2 className="text-lg font-semibold">{doctor.name}</h2>
                <p>Specialty: {doctor.specialty}</p>
                <p>Location: {doctor.location}</p>
                <p>Phone: {doctor.phone}</p>
                {doctor.rating && (
                  <div className="flex items-center">
                    <p>Google rating:</p>
                    {Array.from({ length: Math.round(doctor.rating) }, (_, index) => (
                      <FaStar key={index} className="text-yellow-500 ml-1"
                      />
                    ))}
                  </div>
                )}
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
        callResults={callResults}
        onClose={() => setIsModalVisible(false)}
        activelyCalling={activelyCalling}
      />
      <FinalResultsModal
        isVisible={displayFinalResultsModal}
        callResults={callResults}
        onClose={() => setDisplayFinalResultsModal(false)}
      />


    </div >
  );
}


export default FindBestDoctor
