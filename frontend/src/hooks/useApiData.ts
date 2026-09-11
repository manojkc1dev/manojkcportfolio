import { useState, useEffect } from 'react';
import { ApiResponse } from '../services';

/**
 * Custom hook for fetching data from API with loading and error states
 */
export function useApiData<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiCall();
        
        if (isMounted) {
          if (response.success) {
            setData(response.data);
          } else {
            setError(response.message || 'Failed to fetch data');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => {} };
}

/**
 * Custom hook for fetching array data from API
 */
export function useApiArray<T>(
  apiCall: () => Promise<ApiResponse<T[]>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiCall();
        
        if (isMounted) {
          if (response.success) {
            setData(response.data || []);
          } else {
            setError(response.message || 'Failed to fetch data');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: () => {} };
}
