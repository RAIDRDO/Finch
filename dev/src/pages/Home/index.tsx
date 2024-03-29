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
import useToken from "@/shared/utils/crud/useToken";
import { constructReadQueryFn, constructUrl, createQuery,addPermission} from "@/shared/utils/crud";
import {Organisation,Documents, SPUser} from "@/shared/types/";
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
import { useState ,useContext} from "react";
import { useQuery } from "react-query";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import useUser from "@/shared/utils/crud/useUser"
import { get } from "lodash";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast"
import CategoryCard from "@/components/ui/CategoryCard";
import DraftCard from "@/components/ui/DraftCard";

export default function Home() {
  const [user,setUser] = useContext(AuthContext)
  const navigate = useNavigate()
  const token = useToken()
  const { toast } = useToast()

  const [OrgName, setOrgName] = useState("");
  const [OrgDescription, setOrgDescription] = useState("");
  const [OrgData, setOrgData] = useState<any>([]);
  const [CatData, setCatData] = useState<any>([]);
  const [Drafts, setDrafts] = useState<any>([]);
  const [Documents, setDocuments] = useState<any>([]);


  const getPermissions = useQuery({enabled:!!user,queryKey:["Permissions"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`User eq '${user?.Id}'`))})

//   const GetOrgnisations = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Orgnisations"]
//   ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,"User,Role,OrgLookUp/Id,OrgLookUp/org,OrgLookUp/desc,OrgLookUp/name"
//   ,"OrgLookUp",`(User eq ${user?.Id}) and (ResourceType eq 'organization')`))
// ,onSuccess(data) {
//    const formattedData = data.value.map((item:any)=>{
//       return item.OrgLookUp
//     }) 
//     setOrgData(formattedData)
// }
// },)


  const GetOrgnisations = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Orgnisations"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Organisation,undefined,undefined,undefined))
,onSuccess(data) {
    setOrgData(data.value)
}
},)


const GetCatergories = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Catergories"]
,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Catergory,undefined,undefined,undefined))
,onSuccess(data) {
    setCatData(data.value)

}
},)


const GetDrafts = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Drafts"]
,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Drafts,undefined,undefined,`CreatedBy eq '${user?.Id}'`))
,onSuccess(data) {
    // console.log(data)
    setDrafts(data.value)

}
})

//   const GetDocuments = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Documents"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,"User,Role,DocLookUp/Id,DocLookUp/Document,DocLookUp/Catergory,DocLookUp/Organisation,DocLookUp/CreatedAt,DocLookUp/EditedAt,DocLookUp/SectionOrder,DocLookUp/CurrentCommit,DocLookUp/Name"
//   ,"DocLookUp",`(User eq ${user?.Id}) and (ResourceType eq 'document')`)),
// onSuccess(data) {
//     const formattedData = data.value.map((item:any)=>{
//       return item.DocLookUp
//     }) 
//     setDocuments(formattedData)
// },})


const GetDocuments = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Documents"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,undefined)),
onSuccess(data) {
  
    setDocuments(data.value)
},})



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

  // const addPermission = (OrgId:string,OrgIdSP:number,UserId:string,Email:string,type:string,Role:string) => {
  //     const payload = {
  //          __metadata:{
  //       type: `SP.Data.${config.ListNames.Permissions}ListItem`,

  //   },
      
  //     ...{
  //       Permission:uuidv4(),
  //       User:UserId,
  //       Email:Email,
  //       Resource:OrgId,
  //       OrgLookUp:OrgIdSP,
  //       CatLookUpId:null,
  //       DocLookUp:null,
  //       ResourceType:type,
  //       Role:Role
      
  //     }
  //     }
  //     const res = createQuery(config.ListNames.Permissions,payload,token.data.FormDigestValue)
  //     try {
  //       return res
  //     } catch (error) {
  //       console.log(error)
  //     }
  // }

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
         
            <Button className="w-72 h-24 justify-between text-black text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm "> Create Document <FilePlus></FilePlus></Button> 
            <Button className="w-72 h-24 justify-between text-black  text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm " onClick={()=>navigate('/merges')}> Review Merge Request <GitPullRequest></GitPullRequest></Button> 
        </div>
        <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Recent Documents</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400" onClick={()=>{
                                navigate("/workspace")
              }}>
                View All 
                <ArrowRight className="ml-2"></ArrowRight>
              </Button>
            </div>
            <div className="border"></div>
            {GetDocuments.isSuccess && getPermissions.isSuccess?
                    <div className="flex flex-row space-x-6 overflow-x-auto overflow-hidden">
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
                      return  <DocumentCard key={item.Document} {...DocCardData}></DocumentCard>
                    }
                   
              })}

            </div> :
            <div>
              <p>Loading</p>
            </div>
            
            }
    
                   
        </div>

      <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Your Drafts</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400" onClick={()=>{
                                navigate("/workspace")
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
            {GetOrgnisations.isSuccess && getPermissions.isSuccess?
            <div className="flex flex-row space-x-6 overflow-x-auto overflow-hidden">

                
            {
            OrgData?.map((item:any)=>{
                          // console.log(OrgData)
                          const permissons = getPermissions.data?.value.filter((perm:any)=>perm.Resource == item.org)
                                              // console.log(permissons)

                          if (permissons.length != 0) {

                          const permisson = permissons[0].Role
                          const OrgCardData = {
                            ...item,
                            Role:permisson
                          }
                          return     <OrgansationCard key={item.org} {...OrgCardData}></OrgansationCard>
                        }

                        else{
                           const OrgCardData = {
                            ...item,
                            Role:"None"
                          }
                          return     <OrgansationCard key={item.org} {...OrgCardData}></OrgansationCard>



                        }

            })}


          </div> :
          <div>
            <p>Loading</p>
          </div>
            }
            
        </div>

             <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Categories</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400" onClick={()=>{
                                                navigate(`/categories`)

              }}>
                View All 
                <ArrowRight className="ml-2"></ArrowRight>
              </Button>
            </div>
            <div className="border"></div>
            {GetOrgnisations.isSuccess && getPermissions.isSuccess?
            <div className="flex flex-row space-x-6 overflow-x-auto overflow-hidden">

                
            {
            CatData?.map((item:any)=>{
                          // console.log(OrgData)
                          const permissons = getPermissions.data?.value.filter((perm:any)=>perm.Resource == item.Cat)
                                              // console.log(permissons)

                          if (permissons.length != 0) {

                          const permisson = permissons[0].Role
                          const CatCardData = {
                            ...item,
                            Role:permisson
                          }
                          return     <CategoryCard key={item.Cat} {...CatCardData}></CategoryCard>
                        }

                        else{
                           const CatCardData = {
                            ...item,
                            Role:"None"
                          }
                          return     <CategoryCard key={item.Cat} {...CatCardData}></CategoryCard>



                        }

            })}


          </div> :
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