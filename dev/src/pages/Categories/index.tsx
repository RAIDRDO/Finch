// External library imports - utilities before UI components

// Custom imports - hooks, utilities, components, configs, then styles

import { config } from "@/config";

import MergeItem from "@/components/ui/MergeItem";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import MergeBar from "@/components/ui/MergeBar";
import { Button } from "@/components/ui/button";
import { Plus,GitPullRequest,FilePlus,ArrowRight } from "lucide-react";
import {Catergory} from "@/shared/types/";
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
import { constructReadQueryFn, constructUrl,ReadQuery, createQuery,addPermission } from "@/shared/utils/crud";
import { ResolveRole,ResolvePermissions } from "@/shared/utils/crud/helper";

import { useQuery ,useQueryClient} from "react-query";
import { useState,useContext} from "react";
import useToken from "@/shared/utils/crud/useToken";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import { useToast } from "@/components/ui/use-toast"
import CategoryCard from "@/components/ui/CategoryCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function Categories() {
  const token = useToken()
  const [user,setUser] = useContext(AuthContext)
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [CatergoryName, setCatergoryName] = useState("");
  const [CatergoryDescription, setCatergoryDescription] = useState("");
  const [CatData, setCatData] = useState<any>([]);
  const [OrgList, setOrgList] = useState<any>([]);
  const [selectedOrg, setselectedOrg] = useState<any>();



  const getPermissions = useQuery({enabled:!!user,queryKey:["Permissions"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`User eq '${user?.Id}'`))})

  const GetCatergories = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Catergories"]
,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Catergory,undefined,undefined,undefined))
,onSuccess(data) {
    setCatData(data.value)

}
},)

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







  
  // const GetOrgnisations = useQuery({enabled:!!user && getPermissions.isSuccess,queryKey:["Orgnisations"]
  // ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Organisation,undefined,undefined,undefined)),
  // onSuccess(data) {
  // const orgnames  = data.value.map((item:any)=>{
    
  //   return { 
  //     Id:item.org,
  //     Name:item.name
  //   }})
  // setOrgList(orgnames)
  // }
  // })





 async function getSelectedOrgPerm(OrgId:string,UserId:string,permissons:any) {
   permissons.filter((perm:any)=>perm.Resource == OrgId && perm.User == UserId)
  //  console.log(permissons[0].Role)
   return permissons[0].Role

  

 }
 const AddCategory = (Categorydata:Catergory)=> {
      const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Catergory}ListItem`,

    },
      
      ...Categorydata
      }
      const res = createQuery(config.ListNames.Catergory,payload,token.data.FormDigestValue)
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
              <p className="font-bold text-xl">Category</p>
                 <Dialog>
      <DialogTrigger asChild>
            <Button className="">
                Add Category 
                <Plus className="ml-2"></Plus>
              </Button>      
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>                Add Category </DialogTitle>
          <DialogDescription>
            Type in your new Category name and click create .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category_name" className="text-right">
              Organization Name
            </Label>
                <Select onValueChange={(e)=>setselectedOrg(e)}>
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
            <Input id="category_name"  className="col-span-3" onChange={
              (e)=>{setCatergoryName(e.target.value)}
            } />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category_desc" className="text-right">
              Category Description 
            </Label>
            <Input id="category_desc" className="col-span-3" onChange={
              (e)=>{setCatergoryDescription(e.target.value)}
            } />
          </div>
        
        </div>
        <DialogFooter>
          <Button type="submit" 
          disabled={OrgList.lenght == 0?true:false}
          onClick={
            async () => {
              const data ={Cat:uuidv4(),Org:selectedOrg.Id,Owner:user.Id,Name:CatergoryName}
              const OrgPermissions = await  getSelectedOrgPerm(selectedOrg.Id,user.Id,getPermissions.data.value)
              AddCategory(data)?.then((res:any) => {
                addPermission(token.data.FormDigestValue,data.Cat,res.d.Id,user.Id,user.Email,"category",ResolveRole(OrgPermissions,"create"))
               
                return res
              }).then((res:any) => {
                navigate(`/category/${res.d.Cat}`)
              }).then(()=>{
                queryClient.invalidateQueries(["Catergories"])
                queryClient.invalidateQueries(["Permissions"])
                queryClient.invalidateQueries(["Orgnisations"])

              }).then(() => toast({
          title: "Category Created",

          description: `Your category ${data.Name} has been created successfully.`,
          
        }))

            }
          }
          
          
          >Create</Button>
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
            <div className="flex flex-row justify-evenly flex-wrap">

              {CatData?.map((item:Catergory) => {
                const permissons = getPermissions.data?.value.filter((perm:any)=>perm.Resource == item.Cat)
                if (permissons.length != 0) {
                 const permisson = permissons[0].Role
                 const CatCardData = {
                   ...item,
                   Role:permisson
                 }
                return <CategoryCard key={CatCardData.Cat} {...CatCardData}></CategoryCard>
                }
                else {

                    const CatCardData = {
                    ...item,
                    Role:"None"
                  }
                  return <CategoryCard key={CatCardData.Cat} {...CatCardData}></CategoryCard>
                }
              })}

            </div>
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}