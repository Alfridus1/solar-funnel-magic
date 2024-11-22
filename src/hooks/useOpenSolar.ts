import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useOpenSolar = () => {
  const fetchOpenSolar = useCallback(async (endpoint: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('opensolar', {
        body: { endpoint }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('OpenSolar API Error:', error);
      throw error;
    }
  }, []);

  return {
    fetchOpenSolar
  };
};