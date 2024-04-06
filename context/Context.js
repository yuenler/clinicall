// context/TranscriptContext.js
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }) => {
  const [insuranceData, setInsuranceData] = useState([]);
  const [patientDetails, setPatientDetails] = useState({});
  const [websiteData, setWebsiteData] = useState({});
  const [userCalendar, setUserCalendar] = useState({});


  return (
    <AppContext.Provider value={{
      insuranceData,
      setInsuranceData,
      patientDetails,
      setPatientDetails,
      websiteData,
      setWebsiteData,
      userCalendar,
      setUserCalendar,
    }}>
      {children}
    </AppContext.Provider>
  );
};
