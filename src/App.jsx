import { Suspense } from 'react';
import { QueryClient, QueryCache, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Loading from '@error/Loading';
import StaledData from '@error/401.jsx';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
    },

    queryCache: new QueryCache({
      onError: (err) => {
        console.log(err)
      }
    })
  }
});
function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <QueryClientProvider client={queryClient}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={<StaledData/>}
            >
              <Suspense fallback={<Loading />}>
                <Outlet></Outlet>
              </Suspense>


            </ErrorBoundary>
          )}

        </QueryErrorResetBoundary>
        <ReactQueryDevtools></ReactQueryDevtools>

      </QueryClientProvider >
    </>
  );
}

export default App;
