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
import useToken from "@/shared/utils/crud/useToken";
import { constructReadQueryFn, constructUrl, createQuery} from "@/shared/utils/crud";
import {Organisation,Documents} from "@/shared/types/";
import { config } from "@/config";
import { v4 as uuidv4 } from 'uuid';
import { redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { useQuery } from "react-query";
export default function Home() {
  const navigate = useNavigate()
  const token = useToken()
  const [OrgName, setOrgName] = useState("");
  const [OrgDescription, setOrgDescription] = useState("");
  const [OrgData, setOrgData] = useState<any>([]);
  const GetOrgnisations = useQuery({queryKey:["Orgnisations"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Organisation))
,onSuccess(data) {
    setOrgData(data)
}
},)

  const GetDocuments = useQuery({queryKey:["Documents"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents))})
  const AddOrgnisation = (Organisationdata:Organisation)=> {
      const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Organisation}ListItem`,

    },
      
      ...Organisationdata
      }
      const res = createQuery(config.ListNames.Organisation,payload,token.data.FormDigestValue)
      try {
        return res
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <>
    <NavBar></NavBar>
    <div>
      <div className="flex flex-col mt-10 mx-20 space-y-12">
        <div className="flex flex-row justify-evenly ">
            <Dialog>
      <DialogTrigger asChild>
               <Button className="w-72 h-24 justify-between text-black text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm "> Create Organsation <Plus></Plus></Button>   
        </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>                Add Organization </DialogTitle>
          <DialogDescription>
            Type in your new organization name and click create .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organization_name" className="text-right">
              Organization Name
            </Label>
            <Input id="organization_name"  className="col-span-3" onChange={
              (e)=>{setOrgName(e.target.value)}
            } />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organization_name" className="text-right">
              Organization Description 
            </Label>
            <Input id="organization_name" className="col-span-3" onChange={
              (e)=>{setOrgDescription(e.target.value)}
            } />
          </div>
        
        </div>
        <DialogFooter>
          <Button type="submit" onClick={
                () => {AddOrgnisation({
                  org:uuidv4(),
                  owner: "test",
                  desc:OrgDescription,
                  name:OrgName

                })?.then((res)=>{
                    navigate(`/organization/${res.d.org}`)
                })

              
              }
            }>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
         
            <Button className="w-72 h-24 justify-between text-black text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm "> Create Document <FilePlus></FilePlus></Button> 
            <Button className="w-72 h-24 justify-between text-black  text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm "> Review Merge Request <GitPullRequest></GitPullRequest></Button> 
        </div>
        <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Recent Documents</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400" onClick={()=>{
                                navigate("/documents")
              }}>
                View All 
                <ArrowRight className="ml-2"></ArrowRight>
              </Button>
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly">
              {GetDocuments.data?.map((item:any)=>{
                return <DocumentCard key={item.Document} {...item}></DocumentCard>
              })}
              
            </div>
        </div>
         <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Organizations</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400" onClick={()=>{
                                                navigate(`/organizations`)

              }}>
                View All 
                <ArrowRight className="ml-2"></ArrowRight>
              </Button>
            </div>
            <div className="border"></div>
            {GetOrgnisations.isSuccess?
            <div className="flex flex-row justify-evenly">
            {OrgData?.map((item:any)=>{
                          return     <OrgansationCard key={item.org} {...item}></OrgansationCard>

            })}


          </div> :
          <div>
            test
          </div>
            }
            
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}