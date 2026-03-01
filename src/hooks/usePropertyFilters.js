import { useState, useCallback } from 'react';

const DEFAULT_FILTERS = {
  search:       '',
  type:         '',
  propertyType: '',
  minPrice:     '',
  maxPrice:     '',
  bedrooms:     '',
  city:         '',
};

export const usePropertyFilters = (initial = {}) => {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initial });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, ...initial });
  }, [initial]);

  return { filters, setFilter, resetFilters };
};
