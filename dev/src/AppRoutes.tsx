import {Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Organizations from './pages/Organizations';
import Workspace from './pages/Documents'; 
import Merges from './pages/Merges';
import Editor from './pages/Editor';
import Organization from './pages/Organization';
import Categories from './pages/Categories';
import Category from './pages/Category';
import Test from './pages/test';
import useUser from './shared/utils/crud/useUser';
import { AuthContextProvider ,AuthContext} from './shared/utils/context/authContextProvider';
import { useContext,useEffect } from 'react';
import { constructReadQueryFn } from './shared/utils/crud';
import { useQuery } from 'react-query';
import { config } from './config';
import Viewer from './pages/Viewer';
const AppRoutes = () => {
    // const url = config.apiUrl + `web/currentUser`;
    const url = config.apiUrl + `web/getuserbyid('1')`;

    const user = useQuery({enabled:true,queryKey:["user"],queryFn:constructReadQueryFn(url), onSuccess(data) {
        setUser(data)
    },})
    const [User,setUser] = useContext(AuthContext)
   
    return ( 
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/organizations' element={<Organizations />} />
          <Route path='/organization/:OrgId' element={<Organization/>} />

          <Route path='/categories' element={<Categories />} />
          <Route path='/category/:CatId' element={<Category />} />

          <Route path='/workspace' element={<Workspace />} /> 
          <Route path='/merges' element={<Merges />} />
          <Route path='/editor/:DraftId' element={<Editor />} />
          <Route path='/viewer/:DocId' element={<Viewer/>} />

          <Route path='/test' element={<Test></Test>} />
        </Routes>

     );
}
 
export default AppRoutes;