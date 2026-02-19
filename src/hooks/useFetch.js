import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/apiClient';

// Provides reusable HTTP fetching state and controls for React components.
const useFetch = (url, options = {}) => {
  const { method = 'GET', body = null, dependencies = [], ...axiosOptions } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Executes the request, manages cancellation, and updates request state.
  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        ...axiosOptions,
        signal: abortControllerRef.current.signal,
      };

      if (body && method !== 'GET') {
        config.data = body;
      }

      const response = await apiClient(url, config);
      setData(response.data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.response?.data?.message || err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [url, method, body, JSON.stringify(axiosOptions), ...dependencies]);

  // Triggers the initial request and aborts it when the component unmounts.
  useEffect(() => {
    fetchData();

    // Cancels any in-flight request to avoid state updates after unmount.
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Exposes a manual way to run the same request again.
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;
