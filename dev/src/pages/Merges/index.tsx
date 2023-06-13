// External library imports - utilities before UI components

// Custom imports - hooks, utilities, components, configs, then styles

import ClippedDrawer from "../../components/ClippedDrawer"
import DocumentCard from "../../components/ui/DocumentCard";
import OrgansationCard from "../../components/ui/OrgansationCard";
import MergeItem from "@/components/ui/MergeItem";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import MergeBar from "@/components/ui/MergeBar";
import { Button } from "@/components/ui/button";
import { Plus,GitPullRequest,FilePlus,ArrowRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { config } from "@/config";
import { useState ,useContext} from "react";
import { useQuery } from "react-query";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import { constructReadQueryFn, constructUrl, createQuery,addPermission} from "@/shared/utils/crud";
export default function Merges() {
  const [user,setUser] = useContext(AuthContext)
  const [MergeRequests, setMergeRequests] = useState<any>();
  const getMergeRequests = useQuery({enabled:!!user,queryKey:["MergeRequests"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.MergeRequests,undefined,undefined,undefined))
,onSuccess(data) {
    setMergeRequests(data.value)
  
}
  }
)
  return (
    <>
    <NavBar></NavBar>
    <div>
      <div className="flex flex-col mt-10 mx-20 space-y-12">
         <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Merges</p>
            </div>
            <div className="border"></div>
            <div className="flex flex-col space-y-2">
              {MergeRequests?.map((item:any)=>{
                return <MergeItem{...item}></MergeItem>
              }
              )}
            </div>
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}