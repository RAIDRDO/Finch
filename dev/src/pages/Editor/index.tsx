import React, { useState,useContext} from 'react';
import EditorCell from "@/components/ui/EditorCell";
import {ChangesProps,Sections,Changes,Commit} from '@/shared/types' 
import { PlusCircle,ArrowLeft } from 'lucide-react';
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
import { Input } from "@/components/ui/input"
import { useQuery ,useQueryClient} from "react-query";
import { constructReadQueryFn, constructUrl, createQuery ,deleteQuery,updateQuery,ReadQuery} from "@/shared/utils/crud";
import { groupBy,FormatPatches } from '@/shared/utils/crud/helper';
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import useToken from "@/shared/utils/crud/useToken";
import CryptoJS from 'crypto-js';
import MarkdownCell from '@/components/ui/MarkdownCell';
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import { CreateCommit } from '@/shared/utils/crud/helper';
import { User } from 'lucide-react';
import { set } from 'lodash';
import { Button } from '@/components/ui/button';
import { read } from 'fs';
import { format } from 'path';
import Merges from '../Merges';

interface IsEdited{
    Edited?:boolean
}

interface IsEditeds extends Array<IsEdited>{}

const Editor = () => {
    const [user,setUser] = useContext(AuthContext)

    const token = useToken()
    const navigate = useNavigate()
    const params = useParams();
    const queryClient = useQueryClient()
    const [Cells, setCells] = useState<ChangesProps>([]);
    const [IsEdited, setIsEdited] = useState<any>({});
    const [Staged, setStaged] = useState<any>({});
    const GetDrafts = useQuery({queryKey:["Drafts"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Drafts,undefined,undefined,`Draft eq '${params.DraftId}'`))})
    const GetDocument = useQuery({enabled:GetDrafts.isSuccess,queryKey:["Documents"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,`Document eq '${GetDrafts.data?.value[0].Document}'`))})
    const GetSections = useQuery({queryKey:["Changes"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Changes,undefined,undefined,`Draft eq '${params.DraftId}'`))
  ,onSuccess(data) {
      setCells(data.value)
      data.value.map((cell:Changes) => {
        const unstaged:any = {}
        unstaged[cell.Change] = {original:cell.Content,new:""}
        setStaged((prevState:any)=>({...prevState,...unstaged}))
      })
  }
  },)
  // console.log(GetDrafts)

    const addCell = (DraftId:string) => {
        SaveCells()
        const CellData:Changes = {
            Change:uuidv4(),
            Section:uuidv4(),
            Document:GetDrafts.data.value[0].Document,
            Draft:DraftId,
            Content:"",
            CreatedAt:Date(),
            EditedAt:"",
            CurrentCommit:"",
            }
        const NewCellpayload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Changes}ListItem`,

    },
      
      ...CellData
      }
      const res = createQuery(config.ListNames.Changes,NewCellpayload,token.data.FormDigestValue).then((res) => {
        queryClient.invalidateQueries("Changes")
        return res
      })

      const DiffPatch = CreateCommit(GetDrafts.data.value[0].Name,"","")
      const commit:Commit = {
        CommitKey:uuidv4(),
        Document:GetDrafts.data.value[0].Document,
        Draft:params.DraftId!,
        Section:CellData.Section,
        Change:CellData.Change,
        Patch:JSON.stringify(DiffPatch.Patch),
        Diff:DiffPatch.DiffStr,
        CommitType:"create",
        CommittedAt:Date(),
        User:user?.Id,
      }
      const CommitPayload = {
        __metadata:{
      type: `SP.Data.${config.ListNames.Commits}ListItem`,
  },
  ...commit
  }
   createQuery(config.ListNames.Commits,CommitPayload,token.data.FormDigestValue)



      try {
        return res
      } catch (error) {
        console.log(error)
      }        
    }

    const  DeleteCell = (ChangeId: string) =>{
        SaveCells()
        const deleteCell:Changes = Cells.filter((cell:any) => cell.Change == ChangeId)[0];
        const stage = Staged[ChangeId]
        const DiffPatch = CreateCommit(GetDrafts.data.value[0].Name,stage.original,"")
        const commit = {
            CommitKey:uuidv4(),
            Document:deleteCell.Document,
            Draft:deleteCell.Draft,
            Section:deleteCell.Section,
            Change:deleteCell.Change,
            Patch:JSON.stringify(DiffPatch.Patch),
            Diff:DiffPatch.DiffStr,
            CommitType:"delete",
            CommittedAt:Date(),
            User:user?.Id,
          }
          const CommitPayload = {
            __metadata:{
          type: `SP.Data.${config.ListNames.Commits}ListItem`,
      },
      ...commit
      }
        deleteQuery(config.ListNames.Changes,deleteCell.Id!,token.data.FormDigestValue).then(() => {
        queryClient.invalidateQueries("Changes")
        })
        createQuery(config.ListNames.Commits,CommitPayload,token.data.FormDigestValue)

        
    }

    const EditCell = (ChangeId: string,Content:string ) =>{
        const editedCell = Cells.filter((cell:any) => cell.Change == ChangeId)[0];
        const index = Cells.indexOf(editedCell);
        editedCell.Content = Content
        editedCell.EditedAt = Date()
        Cells[index]=editedCell;
        if (IsEdited[ChangeId] == undefined){
            const edited:any = {}
            edited[ChangeId] = {Edited:true}
            setIsEdited((prevState:any)=>({...prevState,...edited}))
        }
        const stage:any = Staged[ChangeId]
        stage.new = Content
        setStaged((prevState:any)=>({...prevState,...stage}))


        setCells(Cells)
    }
    const filterDataPayload = (data:any) =>{
        const  {Id,Old_Id,...NewData} = data
        return NewData
    }
    const FilterEdited = (Cells:ChangesProps) =>{
        const filtered = Cells.filter((cell) =>  Object.keys(IsEdited).includes(cell.Change))
        return filtered
    }

    const SaveCells = () =>{
            const EditedCells = FilterEdited(Cells)
            EditedCells.map((cell:Changes) => {
                const data = filterDataPayload(cell)
                const StagedChanges = Staged[cell.Change]
                const DiffPatch = CreateCommit(GetDrafts.data.value[0].Name,StagedChanges.original,StagedChanges.new)
                const commit:Commit = {
                  CommitKey:uuidv4(),
                  Document:cell.Document,
                  Draft:cell.Draft,
                  Section:cell.Section,
                  Change:cell.Change,
                  Patch:JSON.stringify(DiffPatch.Patch),
                  Diff:DiffPatch.DiffStr,
                  CommitType:"edit",
                  CommittedAt:Date(),
                  User:user?.Id,
                }
                const CommitPayload = {
                  __metadata:{
                type: `SP.Data.${config.ListNames.Commits}ListItem`,
            },
            ...commit
            }
                const payload = {
                    __metadata:{
                 type: `SP.Data.${config.ListNames.Changes}ListItem`,
             
             },
               
               ...data
               }
               updateQuery(config.ListNames.Changes,cell.Id,payload,token.data.FormDigestValue).then(() => {
                queryClient.invalidateQueries("Changes")
              }).then(() => {
                setIsEdited({})
              })
              createQuery(config.ListNames.Commits,CommitPayload,token.data.FormDigestValue).then(() => {
                setStaged({})
              })


              try {
                
              } catch (error) {
                console.log(error)
              }
                
            })

    }
    const  CreateMergeRequest = async () =>{
      const commits = await ReadQuery(constructUrl(config.ListNames.Commits,undefined,undefined,`Draft eq '${params.DraftId}'`))
      const formattedCommits = FormatPatches(groupBy(commits,"Section"))
      const Merges = formattedCommits.map((commit:any) => {
        const Merge = {
        Merge:uuidv4(),
        ...commit,
        CreatedAt:Date(),
        CreatedBy:user?.Id,
        
      }
      return Merge
      })
      const MergeIds  = Merges.map((merge:any) => merge.Merge)
      
      Merges.forEach((merge:any) => {
        const payload = {
          __metadata:{
       type: `SP.Data.${config.ListNames.Merges}ListItem`,
          }
          ,
          ...merge
        }
        createQuery(config.ListNames.Merges,payload,token.data.FormDigestValue)
      })

      const MergeRequest = {
        MergeRequest:uuidv4(),
        Merges:JSON.stringify(MergeIds),
        Document:Merges[0].Document,
        DocumentName:GetDocument.data.value[0].Name,
        Draft:Merges[0].Draft,
        DraftName:GetDrafts.data.value[0].Name,
        SubmittedBy:user?.Id,
        SubmittedDate:Date(),
        ApporvedBy:"",
        ApprovalDate:"",
        MergeMsg:"",
      }

      const payload = {
        __metadata:{
      type: `SP.Data.${config.ListNames.MergeRequests}ListItem`,

      },
      ...MergeRequest
      }
      createQuery(config.ListNames.MergeRequests,payload,token.data.FormDigestValue)

    }


    return ( 
    <div>
    <div className='flex flex-row justify-between items-center'>

    <div className='flex flex-row items-center mt-4 ml-4'>
    <ArrowLeft className='h-10 w-10 text-slate-400 hover:text-slate-900'></ArrowLeft>
    <div className=' flex flex-col'>
    <Input className='w-36 ml-3' disabled></Input>
    <Menubar className='border-none'>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>

          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem onClick={()=>{
            SaveCells()
          }}>
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    </div>
     

      </div>
          <div className='mr-8'>
        <Button onClick={()=>CreateMergeRequest()} > Create Merge Request </Button>
      </div>
  </div>

  
   
        <div className="flex flex-row justify-center">
        <div className='flex flex-col w-9/12  items-center'>
        <div className="flex flex-col w-9/12 h-full">
        {Cells.map((CellData:Sections) => (

            <EditorCell Cellprop={CellData} Delete = {DeleteCell} Edit={EditCell} key={CellData.Section}></EditorCell>
     
            // <MarkdownCell  text={CellData.Content}></MarkdownCell>

        ))}
        </div>

        <PlusCircle className='mt-2 text-slate-400 hover:text-slate-500 hover:cursor-pointer' size={32} onClick={()=>{addCell(params.DraftId!)}} />
        </div>


        </div>
        </div>
        

     );
}
 
export default Editor;