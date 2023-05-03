import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Organizations from './pages/Organizations';
import Documents from './pages/Documents';
import Merges from './pages/Merges';
import Editor from './pages/Editor';
import './App.css';
import Organization from './pages/Organization';
import Categories from './pages/Categories';
import Category from './pages/Category';
// Create client
const queryClient = new QueryClient();

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/organizations' element={<Organizations />} />
          <Route path='/organization/:OrgId' element={<Organization/>} />

          <Route path='/categories' element={<Categories />} />
          <Route path='/category/:CatId' element={<Category />} />

          <Route path='/documents' element={<Documents />} /> 
          <Route path='/merges' element={<Merges />} />
          <Route path='/editor' element={<Editor />} />

        </Routes>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
