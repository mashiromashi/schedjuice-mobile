import { axiosClient } from '@/lib/api';
import {
  retrieveParsedDataFromSecureStore,
  serializeAndSaveToSecureStore,
} from '@/lib/helpers/json-helper';
import { organizationType } from '@/types/organization';
import { useEffect, useState } from 'react';

const TENANT_STORE_KEY = 'tenant';
const THEME_STORE_KEY = 'theme';

export const useTenant = () => {
  const [tenant, setTenant] = useState<organizationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTenant = async () => {
      setIsLoading(true);
      try {
        const cachedTenant = await retrieveParsedTenant();
        if (cachedTenant) {
          if (isMounted) {
            setTenant(cachedTenant);
          }
          return;
        }

        const { data } = await axiosClient.get('organizations/public');
        await persistTenant(data.data);
        if (isMounted) {
          setTenant(data.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTenant();

    return () => {
      isMounted = false;
    };
  }, []);

  const refetchTenant = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosClient.get('organizations/public');
      await persistTenant(data.data);
      setTenant(data.data);
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { tenant, isLoading, refetchTenant };
};

async function retrieveParsedTenant(): Promise<organizationType | null> {
  try {
    return await retrieveParsedDataFromSecureStore<organizationType>(TENANT_STORE_KEY);
  } catch {
    return null;
  }
}

async function persistTenant(currentTenant: organizationType) {
  await serializeAndSaveToSecureStore(TENANT_STORE_KEY, currentTenant);
}
