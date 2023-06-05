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
import * as DialogPrimitive from "@radix-ui/react-dialog"
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
import { useState } from "react";
import { Documents ,Catergory} from "@/shared/types";
import { config } from "@/config";
import useToken from "@/shared/utils/crud/useToken";
import { constructReadQueryFn, constructUrl, createQuery,addPermission } from "@/shared/utils/crud";
import { useQuery ,useQueryClient} from "react-query";
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import {useContext} from "react";
import { ResolveRole,ResolvePermissions } from "@/shared/utils/crud/helper";
import DraftCard from "@/components/ui/DraftCard";

export default function Category() {
  const [user,setUser] = useContext(AuthContext)
  const token = useToken()
  const navigate = useNavigate()
  const params = useParams();
  const queryClient = useQueryClient()
  const [DocumentName, setDocumentName] = useState("");
  const [Catergories, setCatergories] = useState<any>();
  const [Documents, setDocuments] = useState<any>();
  const [Drafts, setDrafts] = useState<any>();
  const getPermissions= useQuery({enabled:!!user?.Id , queryKey:["Permissions"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`(Resource eq '${params.CatId}') and (User eq ${user?.Id})`))})
   const GetCatergories = useQuery({enabled:getPermissions.isSuccess,queryKey:["Catergories"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Catergory,undefined,undefined,`Cat eq '${params.CatId}'`))
  ,onSuccess(data) {
      setCatergories(data.value[0])
  }
  },)

  const GetDocuments = useQuery({enabled:getPermissions.isSuccess,queryKey:["Documents"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,`Catergory eq '${params.CatId}'`))
,onSuccess(data) {
  setDocuments(data.value)
}
},)
const GetDrafts = useQuery({enabled:getPermissions.isSuccess,queryKey:["Drafts"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Drafts,undefined,undefined,`Catergory eq '${params.CatId}'`))
,onSuccess(data) {
  setDrafts(data.value)
}
},)  


   const AddDocument = (Documentsdata:Documents)=> {
      const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Documents}ListItem`,

    },
      
      ...Documentsdata
      }
      const res = createQuery(config.ListNames.Documents,payload,token.data.FormDigestValue)
      try {
        return res
      } catch (error) {
        console.log(error)
      }
  }
//  const addPermission = (OrgId:string,OrgIdSP:number,UserId:string,Email:string,type:string,Role:string) => {
//       const payload = {
//            __metadata:{
//         type: `SP.Data.${config.ListNames.Permissions}ListItem`,

//     },
      
//       ...{
//         Permission:uuidv4(),
//         User:UserId,
//         Email:Email,
//         Resource:OrgId,
//         ResourceSP:OrgIdSP,
//         resourceType:type,
//         Role:Role
      
//       }
//       }
//       const res = createQuery(config.ListNames.Permissions,payload,token.data.FormDigestValue)
//       try {
//         return res
//       } catch (error) {
//         console.log(error)
//       }
//   }



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
                Add Documents 
                <Plus className="ml-2"></Plus>
              </Button>      
        </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>       Add Documents </DialogTitle>
          <DialogDescription>
            Type in your new Documents name and click create .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category_name" className="text-right">
              Category Name
            </Label>
            <Input id="category_name"  className="col-span-3" onChange={
              (e) => {
                setDocumentName(e.target.value);
              }
            } />
          </div>
        
        </div>
        <DialogFooter>
          <DialogPrimitive.Close asChild>
          <Button type="submit" onClick={
            () => {
              const data ={Document:uuidv4(),Organisation:Catergories.Org,Catergory:Catergories.Cat,CreatedAt:Date(),EditedAt:Date(),Sections:"",CurrentCommit:"",CurrentMerge:"",Name:DocumentName}
              AddDocument(data)?.then((res)=>
                {
                  addPermission(token.data.FormDigestValue,data.Document,res.d.Id,user?.Id,user?.Email,'document',ResolveRole(getPermissions.data.value[0].Role,"create"))?.then(()=>{
                  queryClient.invalidateQueries("Documents")

                  })
                
                }
              )
            }
          }>Create</Button>
          </DialogPrimitive.Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
            </div>
            <div className="flex flex-row space-x-1">
                    <div className="text-slate-400 font-semibold hover:underline hover:text-slate-500 hover:cursor-pointer">
                        <p>{Catergories?.Name}</p>
                    </div>
                    
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly">
              {
                Documents?.map((data:any)=>{
                  return <DocumentCard key={data.Document} {...data} ></DocumentCard>

                })
              }


            </div>
        </div>

       
      </div>
    </div>
       <div>
      <div className="flex flex-col mt-10 mx-20 space-y-12">
         <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Drafts</p>
            
            </div>
            <div className="flex flex-row space-x-1">
                    <div className="text-slate-400 font-semibold hover:underline hover:text-slate-500 hover:cursor-pointer">
                        <p>{Catergories?.Name}</p>
                    </div>
                    
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly">
              {
                Drafts?.map((data:any)=>{
                  return <DraftCard key={data.Draft} {...data} ></DraftCard>

                })
              }


            </div>
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}