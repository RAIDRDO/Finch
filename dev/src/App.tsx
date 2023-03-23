import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import './App.css';

// Create client
const queryClient = new QueryClient();

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
