// context/TranscriptContext.js
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const ContextProvider = ({ children }) => {
  const [insuranceData, setInsuranceData] = useState({});
  const [profile, setProfile] = useState({});
  const [websiteData, setWebsiteData] = useState({});


  return (
    <AppContext.Provider value={{
      insuranceData,
      setInsuranceData,
      profile,
      setProfile,
      websiteData,
      setWebsiteData,
    }}>
      {children}
    </AppContext.Provider>
  );
};
