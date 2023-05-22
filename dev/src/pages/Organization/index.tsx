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
import { constructReadQueryFn, constructUrl, createQuery } from "@/shared/utils/crud";

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
import { Catergory } from "@/shared/types";
import { config } from "@/config";
import useToken from "@/shared/utils/crud/useToken";
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import { useQuery ,useQueryClient} from "react-query";
import { v4 as uuidv4 } from 'uuid';
import React from "react";
import CategoryCard from "@/components/ui/CategoryCard";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import {useContext} from "react";
export default function Organization() {
  const [user,setUser] = useContext(AuthContext)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const params = useParams();

  const [OrgData, setOrgData] = useState<any>();
  const [Catergories, setCatergories] = useState<any>();
  const token = useToken()
  
  const getPermissions= useQuery({enabled:!!user?.Id , queryKey:["Permissions"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`(Resource eq '${params.OrgId}') and (User eq ${user?.Id})`))})

  const GetOrgnisations = useQuery({enabled:getPermissions.isSuccess,queryKey:["Orgnisations"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Organisation,undefined,undefined,`org eq '${params.OrgId}'`))
,onSuccess(data) {
    console.log("orgdata",data)
    setOrgData(data.value[0])
    console.log("check org data")
    console.log(OrgData)
}
},)
 const GetCatergories = useQuery({enabled:getPermissions.isSuccess,queryKey:["Catergories"]
  ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Catergory,undefined,undefined,`Org eq '${params.OrgId}'`))
,onSuccess(data) {
    setCatergories(data.value)
}
},)
  const addPermission = (OrgId:string,UserId:string,Email:string,Role:string) => {
      const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Permissions}ListItem`,

    },
      
      ...{
        Permission:uuidv4(),
        User:UserId,
        Email:Email,
        Resource:OrgId,
        Role:Role
      
      }
      }
      const res = createQuery(config.ListNames.Permissions,payload,token.data.FormDigestValue)
      try {
        return res
      } catch (error) {
        console.log(error)
      }
  }



  const [CatergoryName, setCatergoryName] = useState("");
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
          <DialogTitle>       Add Category </DialogTitle>
          <DialogDescription>
            Type in your new category name and click create .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category_name" className="text-right">
              Category Name
            </Label>
            <Input id="category_name"  className="col-span-3" onChange={
              (e) => {
                setCatergoryName(e.target.value);
              }
            } />
          </div>
        
        </div>
        <DialogFooter>
          <DialogPrimitive.Close asChild>
          <Button type="submit" onClick={
            () => {
              console.log("btn click",OrgData)
              AddCategory({Cat:uuidv4(),Org:OrgData.org,Owner:user.Id,Name:CatergoryName})?.then((res) => {
                queryClient.invalidateQueries("Catergories")
                return res
              }).then((res) => {
                navigate(`/category/${res.d.Cat}`)
              })
            }
          }>Create</Button>
          </DialogPrimitive.Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
            </div>
            <div className="flex flex-row space-x-1">
                    <div className="text-slate-400 font-semibold hover:underline hover:text-slate-500 hover:cursor-pointer">
                        
                        <p>{OrgData?.name}</p>
                    </div>
                    
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly">
              {Catergories?.map((item:Catergory) => {
                return <CategoryCard key={item.Cat} {...item}></CategoryCard>

              })} 

            </div>
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}