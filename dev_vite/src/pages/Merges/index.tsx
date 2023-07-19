// External library imports - utilities before UI components

// Custom imports - hooks, utilities, components, configs, then styles

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export default function Merges() {
  const parsenNulltoStr = (MergeRequests:any) =>{
    try{
      const ParsedMergeRequest:any = MergeRequests.map((MergeRequest:any)=>{
        if (MergeRequest.ApporvedBy == null || MergeRequest.ApporvedBy == "None"){
          MergeRequest.ApporvedBy = ""
          return MergeRequest

        }
        else{
          return MergeRequest
        }
      })
      console.log(ParsedMergeRequest)
      return ParsedMergeRequest
    }
    catch(error) {
      console.error("error parsing null to empty str:",error)
    }
   
  }
  const [user,setUser] = useContext(AuthContext)
  const [MergeRequests, setMergeRequests] = useState<any>();
  const getMergeRequests = useQuery({enabled:!!user,queryKey:["MergeRequests"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.MergeRequests,undefined,undefined,undefined))
,onSuccess(data) {
    setMergeRequests(parsenNulltoStr(data.value))
  
}
  }
)

  const Pending = MergeRequests?.filter((item:any)=>item.ApporvedBy == "")
  const Merged = MergeRequests?.filter((item:any)=>item.ApporvedBy != "")
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
  <Tabs defaultValue="pending" className="">
  <TabsList>
    <TabsTrigger value="pending">Pending</TabsTrigger>
    <TabsTrigger value="merged">Merged</TabsTrigger>
  </TabsList>
  <TabsContent className="flex flex-col space-y-2" value="pending">


              {Pending?.map((item:any)=>(
                <MergeItem {...item} key = {item.MergeRequest}></MergeItem>
              )
              )}
              
  </TabsContent>
  <TabsContent className="flex flex-col space-y-2" value="merged">

  {Merged?.map((item:any)=>(
                <MergeItem {...item} key = {item.MergeRequest}></MergeItem>
              )
              )}
  </TabsContent>
</Tabs>

        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}