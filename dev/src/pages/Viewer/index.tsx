import React, { useState,useContext } from 'react';
import EditorCell from "@/components/ui/EditorCell";
import {CellProps,Sections,Drafts,Changes,Commit} from '@/shared/types' 
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
import { CreateCommit } from '@/shared/utils/crud/helper';
const Viewer = () => {
    const token = useToken()
    const [user,setUser] = useContext(AuthContext)

    const [Cells, setCells] = useState<CellProps>([]);

    const params = useParams();
    const queryClient = useQueryClient()
    const GetDocuments = useQuery({queryKey:["Documents"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,`Document eq '${params.DocId}'`))})
    const GetSections = useQuery({queryKey:["Sections"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Sections,undefined,undefined,`Document eq '${params.DocId}'`))
  ,onSuccess(data) {
      setCells(data.value)
  }
  },)

  
  const CreateDraft = ()=>{
    const draft:Drafts = {
        Draft:uuidv4(),
        Document:GetDocuments.data?.value[0].Document,
        Catergory:GetDocuments.data?.value[0].Catergory,
        Organisation:GetDocuments.data?.value[0].Organisation,
        CreatedAt:Date(),
        EditedAt:Date(),
        Sections:"",
        CurrentCommit:"",
        CurrentMerge:"",
        CurrentVersion:0,
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
            User: user?.Id

            
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
        <Button onClick={()=>CreateDraft()}> Create Draft <FileEdit className='h-4 w-4 ml-2'/></Button>
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