import Select from 'react-select';

function FilterDoctorsCard({
  onFilterDoctors,
  onTransportTypeChange,
  onFilterChange,
  transportType,
  travelTime,
  onTravelTimeChange,
  filter }) {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="p-5"
      >
        <h3 className="text-lg font-medium text-gray-900">Help us narrow down your options:</h3>
        <div
          className='flex items-center gap-2'
        >
          <div className="mt-2">
            <label htmlFor="transportType" className="block text-sm font-medium text-gray-700">
              Your preferred transport:
            </label>
            <Select
              id="transportType"
              className="mt-1"
              options={[
                { value: 'car', label: 'Car' },
                { value: 'publicTransport', label: 'Public Transport' },
                { value: 'bike', label: 'Bike' },
                { value: 'walk', label: 'Walk' }
              ]}
              onChange={onTransportTypeChange}
              value={transportType}
              placeholder="Select transport type"
              isClearable
              isSearchable
            />
          </div>
          <div className="mt-2">
            <label htmlFor="travelTime" className="block text-sm font-medium text-gray-700">
              Travel time
            </label>
            <Select
              id="travelTime"
              className="mt-1"
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '60 minutes' },
                { value: '75', label: '75 minutes' },
                { value: '90', label: '90 minutes' }
              ]}
              onChange={onTravelTimeChange}
              value={travelTime}
              placeholder="Select max travel time"
              isClearable
              isSearchable
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="doctorPreferences" className="block text-sm font-medium text-gray-700">
            Your preferences (doctor education, gender, ethnicity, ratings, specialty etc.)
          </label>
          <textarea
            id="doctorPreferences"
            rows="3"
            className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Type here..."
            value={filter}
            onChange={onFilterChange}
          ></textarea>
        </div>
      </div>
      <div className="px-5 py-3 bg-gray-50 text-right">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onFilterDoctors}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default FilterDoctorsCard;
