// External library imports - utilities before UI components

// Custom imports - hooks, utilities, components, configs, then styles
import { config } from "@/config";

import ClippedDrawer from "../../components/ClippedDrawer"
import DocumentCard from "../../components/ui/DocumentCard";
import OrgansationCard from "../../components/ui/OrgansationCard";
import MergeItem from "@/components/ui/MergeItem";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import MergeBar from "@/components/ui/MergeBar";
import { Button } from "@/components/ui/button";
import { Plus,GitPullRequest,FilePlus,ArrowRight } from "lucide-react";
import {Organisation} from "@/shared/types/";
import { v4 as uuidv4 } from 'uuid';

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
import { useNavigate } from "react-router-dom";
import { constructReadQueryFn, constructUrl, createQuery } from "@/shared/utils/crud";
import { useQuery } from "react-query";
import { useState,useContext} from "react";
import useToken from "@/shared/utils/crud/useToken";
import { AuthContext } from "@/shared/utils/context/authContextProvider";

export default function Organizations() {
  const token = useToken()
  const [user,setUser] = useContext(AuthContext)

  const navigate = useNavigate()

  const [OrgData, setOrgData] = useState();

  const [OrgName, setOrgName] = useState("");
  const [OrgDescription, setOrgDescription] = useState("");
    const GetOrgnisations = useQuery({queryKey:["Orgnisations"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Organisation))
  ,onSuccess(data) {
      setOrgData(data)
  }
  },)
  const getPermissions = useQuery({enabled:!!user,queryKey:["Permissions"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`User eq '${user?.Id}'`))})

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
         <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Organizations</p>

          <Dialog>
      <DialogTrigger asChild>
 <Button className="">
                Add  Organization
                <Plus className="ml-2"></Plus>
              </Button>  
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
         
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly">
              {
                GetOrgnisations.data?.map((item:Organisation)=>{
                  const permisson = getPermissions.data?.value.filter((perm:any)=>perm.Resource == item.org)[0].Role
                  // console.log(permisson)
                  const orgCardData = {
                    ...item,
                    Role:permisson
                  }
                  return     <OrgansationCard key={item.org} {...orgCardData}></OrgansationCard>                })
              }
              
              {/* <OrgansationCard></OrgansationCard> */}

            </div>
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}