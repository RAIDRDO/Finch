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
import { v4 as uuid } from 'uuid';
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
import { constructReadQueryFn, constructUrl, createQuery } from "@/shared/utils/crud";
import { useQuery ,useQueryClient} from "react-query";
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import {useContext} from "react";
export default function Category() {
  const [user,setUser] = useContext(AuthContext)
  const token = useToken()
  const navigate = useNavigate()
  const params = useParams();
  const queryClient = useQueryClient()
  const [DocumentName, setDocumentName] = useState("");
  const [Catergories, setCatergories] = useState<any>();
  const [Documents, setDocuments] = useState<any>();
   const GetCatergories = useQuery({queryKey:["Catergories"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Catergory,undefined,undefined,`Cat eq '${params.CatId}'`))
  ,onSuccess(data) {
      setCatergories(data.value[0])
  }
  },)

  const GetDocuments = useQuery({queryKey:["Documents"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents))
,onSuccess(data) {
  setDocuments(data.value)
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
              AddDocument({Document:uuid(),Organisation:Catergories.Org,Catergory:Catergories.Cat,CreatedAt:Date(),EditedAt:Date(),Sections:"",CurrentCommit:"",CurrentMerge:"",Name:DocumentName})?.then(()=>
                {queryClient.invalidateQueries("Documents")}
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
                        <p>Organization name</p>
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
    <Footer></Footer>
    </>
  );
}