import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // onError: (error) => {
    //   console.error('Error in query:', error);
    // },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Error in mutation:', error);
      if (isAxiosError(error)) {
        // Toast.show(error.response?.data.detail);
      } else {
        // Toast.show("Error in mutation.");
      }
    },
  }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

export { queryClient };
