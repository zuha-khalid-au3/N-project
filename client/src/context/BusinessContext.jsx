import { createContext, useContext, useEffect, useState } from 'react';
import { businessConfig as defaults, mergeBusinessConfig } from '../config/business.js';
import { fetchBusiness } from '../services/productService.js';

const BusinessContext = createContext(defaults);

export function BusinessProvider({ children }) {
  const [business, setBusiness] = useState(defaults);

  useEffect(() => {
    fetchBusiness()
      .then((response) => setBusiness(mergeBusinessConfig(response.data.business)))
      .catch(() => setBusiness(defaults));
  }, []);

  return <BusinessContext.Provider value={business}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  return useContext(BusinessContext);
}
