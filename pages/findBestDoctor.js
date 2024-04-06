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

function FindBestDoctor() {
  const [loading, setLoading] = useState(false);
  const { websiteData, insuranceData, setInsuranceData, patientDetails } = useAppContext();
  const [showAlert, setShowAlert] = useState(false);
  const [loadingText, setLoadingText] = useState('Searching for doctors...');
  const [filter, setFilter] = useState('');
  const [selectedDoctors, setSelectedDoctors] = useState([]);

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

  // Optionally, implement a function to call all doctors in the list in order here

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
            There are a lot of {patientDetails.doctorType.toLowerCase()}s in your area to choose from! Would you like me to do some research on them to filter it down to just a few?
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
      </div>


      <div className="space-y-4">
        <h2 className="text-lg font-semibold mt-8">Doctors in Your Area</h2>

        {insuranceData && insuranceData.length > 0 && insuranceData.map((doctor, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold">{doctor.name}</h2>
            <p>Specialty: {doctor.specialty}</p>
            <p>Location: {doctor.location}</p>
            <p>Phone: {doctor.phone}</p>
            <p>{doctor.otherInfo}</p>
            {selectedDoctors.find(selectedDoctor => selectedDoctor.name === doctor.name) ? (
              <button
                className="mt-3 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                onClick={() => removeDoctorFromCallList(selectedDoctors.findIndex(selectedDoctor => selectedDoctor.name === doctor.name))}>-</button>
            ) : (
              <button
                className="mt-3 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded"
                onClick={() => addDoctorToCallList(doctor)}>+</button>
            )}

          </div>
        ))}
      </div>


    </div >
  );
}

export default FindBestDoctor


