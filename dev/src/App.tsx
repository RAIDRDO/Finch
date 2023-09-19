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
import React from 'react';
import { createContext } from 'react';
import { config } from './config';
import Test from './pages/test';
import { AuthContextProvider ,AuthContext} from './shared/utils/context/authContextProvider';
import {useContext } from 'react';
import useUser from "@/shared/utils/crud/useUser"
import AppRoutes from './AppRoutes';
import { Toaster } from "@/components/ui/toaster"
import Console from './react_console'
import { Survey } from './components/survey';

// Create client
const queryClient = new QueryClient();
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('react-query/devtools/development').then(d => ({
    default: d.ReactQueryDevtools,
  }))
)

function App() {
  const [showDevtools, setShowDevtools] = React.useState(config.DevMode)
  
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
         {showDevtools ? (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
          <Console></Console> 

        </React.Suspense>
      ) : null}

        <AuthContextProvider>
        <AppRoutes></AppRoutes>
        <Toaster />

        </AuthContextProvider>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
