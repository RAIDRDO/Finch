// External library imports - utilities before UI components

// Custom imports - hooks, utilities, components, configs, then styles
import { config } from "@/config";

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
import { constructReadQueryFn, constructUrl, createQuery,addPermission } from "@/shared/utils/crud";
import { useQuery } from "react-query";
import { useState,useContext} from "react";
import useToken from "@/shared/utils/crud/useToken";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import { useToast } from "@/components/ui/use-toast"

export default function Organizations() {
  const token = useToken()
    const { toast } = useToast()
  const [user,setUser] = useContext(AuthContext)

  const navigate = useNavigate()

  const [Documents, setDocuments] = useState<any>([]);
  const [DocumentName, setDocumentName] = useState("");

  const [OrgName, setOrgName] = useState("");
  const [OrgDescription, setOrgDescription] = useState("");

  const getPermissions = useQuery({enabled:!!user,queryKey:["Permissions"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`User eq '${user?.Id}'`))})
  const GetDocuments = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Orgnisations"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,undefined))
,onSuccess(data) {
    setDocuments(data.value)
}
},)
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
              <p className="font-bold text-xl">Documents</p>

          <Dialog>
      <DialogTrigger asChild>
 <Button className="">
                Add  Document
                <Plus className="ml-2"></Plus>
              </Button>  
        </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>                Add Document </DialogTitle>
          <DialogDescription>
            Type in your new organization name and click create .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="document_name" className="text-right">
              Document Name
            </Label>
            <Input id="document_name"  className="col-span-3" onChange={
              (e)=>{setDocumentName(e.target.value)}
            } />
          </div>
        
        </div>
        <DialogFooter>
          <Button type="submit" onClick={
                () => {
                  const data = {
                  org:uuidv4(),
                  owner: user.Id,
                  desc:OrgDescription,
                  name:OrgName

                }
                  AddOrgnisation(data)?.then((res)=>{
                    addPermission(token.data.FormDigestValue,data.org,res.d.Id,data.owner,user.Email,"organization","Org-Owner")
                    navigate(`/organization/${res.d.org}`)
                }).then(()=>  toast({
          title: "Organisation Created",

          description: `Your organisation ${data.name} has been created successfully.`,
          
        })
                  
                )


              
              }
            }>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
         
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly flex-wrap">
               {Documents?.map((item:any)=>{

                    const permissons = getPermissions.data?.value.filter((perm:any)=>perm.Resource == item.Document)
                    if (permissons.length != 0) {
                       const permisson = permissons[0].Role
                       const DocCardData = {
                      ...item,
                      Role:permisson
                    }
                return <DocumentCard key={item.Document} {...DocCardData}></DocumentCard>

                    }
                    else{
                      return null
                    }
                   
              })}
              {/* <OrgansationCard></OrgansationCard> */}

            </div>
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}