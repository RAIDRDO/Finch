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
import {Documents} from "@/shared/types/";
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
import { useState,useContext,useEffect} from "react";
import useToken from "@/shared/utils/crud/useToken";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import { useToast } from "@/components/ui/use-toast"
import DraftCard from "@/components/ui/DraftCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ResolveRole,ResolvePermissions } from "@/shared/utils/crud/helper";
import { useQueryClient } from "react-query";
export default function Workspace() {
  const token = useToken()
    const { toast } = useToast()
  const [user,setUser] = useContext(AuthContext)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [Documents, setDocuments] = useState<any>([]);
  const [Drafts, setDrafts] = useState<any>([]);
  const [DocumentName, setDocumentName] = useState("");

  const [OrgName, setOrgName] = useState("");
  const [OrgDescription, setOrgDescription] = useState("");
  const [OrgList, setOrgList] = useState<any>([]);
  const [selectedOrg, setselectedOrg] = useState<any>();
  const [CatList, setCatList] = useState<any>([]);
  const [FilteredCatList, setFilteredCatList] = useState<any>([]);

  const [selectedCat, setselectedCat] = useState<any>();

  const getPermissions = useQuery({enabled:!!user,queryKey:["Permissions"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`User eq '${user?.Id}'`))})
  
  
  
  const GetDocuments = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Documents"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,undefined))
,onSuccess(data) {
    setDocuments(data.value)
}
},)

const GetDrafts = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Drafts"]
,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Drafts,undefined,undefined,`CreatedBy eq '${user?.Id}'`))
,onSuccess(data) {
    console.log(data)
    setDrafts(data.value)

}
})

    const GetOrgnisations = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Orgnisations"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,"User,Role,OrgLookUp/Id,OrgLookUp/org,OrgLookUp/desc,OrgLookUp/name"
  ,"OrgLookUp",`(User eq ${user?.Id}) and (ResourceType eq 'organization')`))
,onSuccess(data) {
   const orgnames  = data.value.filter((item:any)=>item.Role.includes("Contributor") || item.Role.includes("Owner")).map((item:any)=>{
    
    return { 
      Id:item.OrgLookUp.org,
      Name:item.OrgLookUp.name
    }})
  setOrgList(orgnames)
}
},)

    const GetCatergories = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Catergories"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,"User,Role,CatLookUp/Id,CatLookUp/Org,CatLookUp/Cat,CatLookUp/Desc,CatLookUp/Name"
  ,"CatLookUp",`(User eq ${user?.Id}) and (ResourceType eq 'category')`))
,onSuccess(data) {
  console.log(data)
   const catnames  = data.value.filter((item:any)=>item.Role.includes("Contributor") || item.Role.includes("Owner")).map((item:any)=>{
    
    return { 
      Id:item.CatLookUp.Cat,
      Org:item.CatLookUp.Org,
      Name:item.CatLookUp.Name
    }})
  setCatList(catnames)
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



  useEffect(() => {
    if (selectedOrg) {
      const filteredCat = CatList.filter((item:any) => item.Org === selectedOrg.Id);
      console.log(filteredCat);
      setFilteredCatList(filteredCat);
    }
  }, [selectedOrg]);

   async function getSelectedOrgPerm(OrgId:string,UserId:string,permissons:any) {
   permissons.filter((perm:any)=>perm.Resource == OrgId && perm.User == UserId)
   console.log(permissons[0].Role)
   return permissons[0].Role

  

 }


  async function getSelectedCatPerm(CatId:string,UserId:string,permissons:any) {
   permissons.filter((perm:any)=>perm.Resource == CatId && perm.User == UserId)
   console.log(permissons[0].Role)
   return permissons[0].Role

  

 }


  function filterCatByOrg(OrgId:string,CatList:any) {
    const filteredCat = CatList.filter((item:any)=>item.Org == OrgId)
    console.log(filteredCat)
    setFilteredCatList(filteredCat)
    console.log("filtered prop",FilteredCatList)

  }
   const handleOrgChange = (e:any) => {
    const selectedOrg = e;
    setselectedOrg(selectedOrg);
    // filterCatByOrg(selectedOrg, CatList);
  };





  return (
    <>
    <NavBar></NavBar>
    <div>
      <div className="flex flex-col mt-10 mx-20 space-y-12">
        <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between flex-wrap">
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
            <Label htmlFor="category_name" className="text-right">
              Organization Name
            </Label>
                <Select onValueChange={(e:any)=>handleOrgChange(e)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {OrgList?.map((item:any)=>{
            return <SelectItem key={item.Id} value={item}>{item.Name}</SelectItem>
          })}
        </SelectGroup>
      </SelectContent>
    </Select>

      
          </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category_name" className="text-right">
              Category Name
            </Label>
                <Select onValueChange={(e:any)=>setselectedCat(e)} disabled={FilteredCatList.length== 0?true:false}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {FilteredCatList?.map((item:any)=>{
            console.log(item)
            return <SelectItem key={item.Id} value={item}>{item.Name}</SelectItem>
          })}
        </SelectGroup>
      </SelectContent>
    </Select>

      
          </div>
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
          <Button type="submit" 
          disabled={(OrgList.lenght == 0 && CatList.lenght ==0) || FilteredCatList.lenght ==0 ?true:false}

         onClick={
            async () => {
              const catperms = await getSelectedCatPerm(selectedCat.Id,user?.Id,getPermissions.data.value)
              console.log(catperms)
              const data ={Document:uuidv4(),Organisation:selectedOrg.Org,Catergory:selectedCat.Id,CreatedAt:Date(),EditedAt:Date(),SectionOrder:"",CurrentCommit:"",CurrentMerge:"",Name:DocumentName}
              AddDocument(data)?.then((res)=>
                {
                addPermission(token.data.FormDigestValue,data.Document,res.d.Id,user?.Id,user?.Email,'document',ResolveRole(catperms,"create"))

                
                }

              ).then(()=>              
              queryClient.invalidateQueries(["Documents","Permissions"])
).then(()=>toast({
          title: "Document Created",

          description: `Your Document ${data.Name} has been created successfully.`,
          
        }))


            }
          }
          
          >Create</Button>
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
                      const DocCardData = {
                      ...item,
                      Role:"None"
                    }
                      return <DocumentCard key={item.Document} {...DocCardData}></DocumentCard>
                    }
                   
              })}
              {/* <OrgansationCard></OrgansationCard> */}

            </div>
        </div>


           <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between flex-wrap">
              <p className="font-bold text-xl">Your Drafts</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400" onClick={()=>{
                                navigate("/documents")
              }}>
                View All 
                <ArrowRight className="ml-2"></ArrowRight>
              </Button>
            </div>
            <div className="border"></div>
            {GetDrafts.isSuccess && getPermissions.isSuccess?
                    <div className="flex flex-row space-x-6 overflow-x-auto overflow-hidden"> 
                {Drafts?.map((item:any)=>{
                  return <DraftCard key={item.Draft} {...item}></DraftCard>
                })}
                    
                    </div> 

               
                   
            : 
            <div>
              <p>Loading</p>
            </div>
            }
          
            
            
            
    
                   
      </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}