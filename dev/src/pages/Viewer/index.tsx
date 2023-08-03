import React, { useState,useContext } from 'react';
import EditorCell from "@/components/ui/EditorCell";
import {CellProps,Sections,Drafts,Changes,Commit,ResourcePermissions} from '@/shared/types' 
import { PlusCircle,ArrowLeft,FileEdit } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { config } from "@/config";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { useQuery ,useQueryClient} from "react-query";
import { constructReadQueryFn, constructUrl, createQuery ,deleteQuery,updateQuery} from "@/shared/utils/crud";
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import useToken from "@/shared/utils/crud/useToken";
import CryptoJS from 'crypto-js';
import MarkdownCell from '@/components/ui/MarkdownCell';
import { gt } from 'lodash';
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import { CreateCommit,ResolvePermissions} from '@/shared/utils/crud/helper';
const Viewer = () => {
    const token = useToken()
    const [user,setUser] = useContext(AuthContext)
    const navigate = useNavigate()

    const [Cells, setCells] = useState<CellProps>([]);
    const [Order, setOrder] = useState<any>([]);

    const params = useParams();
    const queryClient = useQueryClient()
    const getPermissions = useQuery({enabled:!!user,queryKey:["Permissions"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`(Resource eq '${params.DocId}') and (User eq '${user?.Id}')`))})
    const GetDocuments = useQuery({enabled:getPermissions.isSuccess,queryKey:["Documents"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,`Document eq '${params.DocId}'`)),onSuccess:(data)=>{
          // console.log(data.value)
          if (data.value[0].SectionOrder == "" || data.value[0].SectionOrder == null ){
            setOrder([])
          }
          else{
            setOrder(JSON.parse(data.value[0].SectionOrder))
          }
    }})
    const GetSections = useQuery({enabled:getPermissions.isSuccess && GetDocuments.isSuccess,queryKey:["Sections"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Sections,undefined,undefined,`Document eq '${params.DocId}'`))
  ,onSuccess(data) {
      setCells(sortCells(data.value))
  }
  },)
  const permissions = ResolvePermissions(getPermissions.data?.value[0].Role)
  
      const sortCells = (Cells:CellProps) => {
      // console.log("order" ,Order)
      if (Cells.length > 0){
      const sorted = Cells.sort((a,b) => {
        
        return Order.indexOf(a.Section) - Order.indexOf(b.Section)
      })
      // console.log("sorted",sorted)
      return sorted
    }
  else{
    return Cells
  }
  }
  const CreateDraft = async ()=>{
    const draft:Drafts = {
        Draft:uuidv4(),
        Document:GetDocuments.data?.value[0].Document,
        Catergory:GetDocuments.data?.value[0].Catergory,
        Organisation:GetDocuments.data?.value[0].Organisation,
        CreatedAt:Date(),
        EditedAt:Date(),
        SectionOrder:GetDocuments.data?.value[0].SectionOrder,
        CurrentCommit:"",
        CurrentMerge:"",
        CurrentVersion:0,
        CreatedBy:user?.Id,
        Name:GetDocuments.data?.value[0].Name,
    }
              const payload = {
                    __metadata:{
                 type: `SP.Data.${config.ListNames.Drafts}ListItem`,
             
             },
               
               ...draft
               }
    createQuery(
        config.ListNames.Drafts,
        payload,
        token.data.FormDigestValue)
    
    Cells.map((CellData:Sections) => {
        const PatchDiff =  CreateCommit(GetDocuments.data?.value[0].Name,CellData.Content,CellData.Content)
        const changes:Changes ={
            Change:uuidv4(),
            Document:CellData.Document,
            Section:CellData.Section,
            Content:CellData.Content,
            CreatedAt:Date(),
            EditedAt:Date(),
            Draft:draft.Draft,
            CurrentCommit:"",
            Classification:CellData.Classification
        }
         const commit:Commit = {
            CommitKey:uuidv4(),
            Document:CellData.Document,
            Draft:draft.Draft,
            Section:CellData.Section,
            Change:changes.Change,
            Patch:JSON.stringify(PatchDiff?.Patch),
            Diff:PatchDiff?.DiffStr,
            CommittedAt:Date(),
            CommitType:"create",
            User: user?.Id,
            Classification:CellData.Classification


            
        }
        const Changes_payload = {
            __metadata:{
          type: `SP.Data.${config.ListNames.Changes}ListItem`,

        }
        ,
        ...changes
        }
        createQuery(
            config.ListNames.Changes,
            Changes_payload,
            token.data.FormDigestValue)


           const Commit_payload = {
    __metadata:{
  type: `SP.Data.${config.ListNames.Commits}ListItem`,
},
...commit
   }
    createQuery(
        config.ListNames.Commits,
        Commit_payload,
        token.data.FormDigestValue
    )

   })    



    return draft

  }
    const CanEdit = (permissions:ResourcePermissions)=>{
        if(permissions.DocOwner || permissions.DocEditor || permissions.DocContributor){
            return true
        }
        else{
            return false
        }
    }

    return ( 
        <div>
        <div className='flex flex-row justify-between items-center'>
      <div className='flex flex-row items-center  mt-4 ml-4'>
        <ArrowLeft className='h-10 w-10 text-slate-400 hover:text-slate-900'></ArrowLeft>
    <div className=' flex flex-col'>
    <Input className='w-36 ml-3'  disabled></Input>
   
    </div>
      </div>
      <div className='mr-8'>
        {CanEdit(permissions)? 
        <Button  onClick={async ()=>{
          const data = await CreateDraft()
          queryClient.invalidateQueries(["Drafts"])
          navigate(`/editor/${data.Draft}`)
        }}> Create Draft <FileEdit className='h-4 w-4 ml-2'/></Button>
        :
        <Button disabled> Create Draft <FileEdit className='h-4 w-4 ml-2'/></Button>
        
        }
        
      </div>

        </div>
 
   
        <div className="flex flex-row justify-center">
        <div className='flex flex-col w-9/12  items-center'>
        <div className="flex flex-col w-9/12 h-full">
        {Cells.map((CellData:Sections) => (
            // console.log("before md cell",CellData.Content),
     
            <MarkdownCell  text={CellData.Content} key={CellData.Section}></MarkdownCell>

        ))}
        </div>

        </div>


        </div>
        </div>
        

     );
}
 
export default Viewer;