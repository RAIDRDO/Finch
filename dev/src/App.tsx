import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Organizations from './pages/Organizations';
import Category from './pages/Catergory';
import Documents from './pages/Documents';
import './App.css';

// Create client
const queryClient = new QueryClient();

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* <Route path='/' element={<Home />} /> */}
          {/* <Route path='/organizations' element={<Organizations />} /> */}
          {/* <Route path='/category' element={<Category />} /> */}
          <Route path='/' element={<Documents />} />


        </Routes>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
