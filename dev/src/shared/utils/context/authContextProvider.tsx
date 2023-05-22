import { createContext, useState } from "react";
import { config } from "@/config";
import { SPUser } from "@/shared/types";
import { useQuery } from "react-query";
import useUser from "@/shared/utils/crud/useUser"
 const url = config.apiUrl + 'web/currentUser';
export const AuthContext = createContext<any>(null)

export const AuthContextProvider = (props:any) => {
   const [User, setUser] = useState<SPUser|null>(
   ) 
   return (
        <AuthContext.Provider value={[User, setUser]}>
            {props.children}
        </AuthContext.Provider>
   )

}
