import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../api/apiClient';

const useFetch = (url, options = {}) => {
  const { method = 'GET', body = null, dependencies = [], ...axiosOptions } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

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

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

  }, [fetchData]);
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;
