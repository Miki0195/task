
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DynamicForm } from './components/DynamicForm';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000, 
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, 
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <DynamicForm />
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;