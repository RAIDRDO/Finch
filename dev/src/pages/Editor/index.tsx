import React, { useState,useContext} from 'react';
import EditorCell from "@/components/ui/EditorCell";
import {ChangesProps,Sections,Changes,Commit, CellProps} from '@/shared/types' 
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
import { format, parse } from 'path';
import Merges from '../Merges';
import { Reorder,useDragControls } from "framer-motion"
import { Console } from 'console';

interface IsEdited{
    Edited?:boolean
}

interface IsEditeds extends Array<IsEdited>{}

const Editor = () => {
  
    const [user,setUser] = useContext(AuthContext)

    const token = useToken()
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams();
    const queryClient = useQueryClient()
    const [Cells, setCells] = useState<ChangesProps>([]);
    const [IsEdited, setIsEdited] = useState<any>({});
    const [Staged, setStaged] = useState<any>({});
    const [Order, setOrder] = useState<any>([]);
    const DragControls = useDragControls()
    console.log(params)

 

    const GetDrafts = useQuery({enabled:params.DraftId!=undefined,queryKey:["Draft"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Drafts,undefined,undefined,`Draft eq '${params.DraftId}'`)),onSuccess:(data)=>{
          if (data.value[0].SectionOrder == "" || data.value[0].SectionOrder == null ){
            setOrder([])
          }
          else{
            setOrder(JSON.parse(data.value[0].SectionOrder))
          }
    }})
    const DocId = GetDrafts.data?.value[0].Document == undefined ? "" : GetDrafts.data?.value[0].Document
    const GetDocument = useQuery({enabled:GetDrafts.isSuccess && DocId != "",queryKey:["Document"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,`Document eq '${DocId}'`))})
    const GetSections = useQuery({enabled:GetDrafts.isSuccess,queryKey:["Changes"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Changes,undefined,undefined,`Draft eq '${params.DraftId}'`))
  ,onSuccess(data) {

      setCells(sortCells(parsenNulltoStr(data.value)!))

      data.value.map((cell:Changes) => {
        const unstaged:any = {}
        unstaged[cell.Change] = {original_text:cell.Content,new_text:"",original_class:cell.Classification,new_class:""}
        setStaged((prevState:any)=>({...prevState,...unstaged}))
      })

  }
  },)
  // console.log(GetDrafts)

    const parsenNulltoStr = (Cells:ChangesProps) =>{
      try{
        const ParsedCells:ChangesProps = Cells.map((cell)=>{
          if (cell.Content == null){
            cell.Content = ""
          }
          return cell
        })
  
        return ParsedCells
      }
      catch(error) {
        console.error("error parsing null to empty str:",error)
      }
     
    }

    const sortCells = (Cells:ChangesProps) => {
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

    const changeOrder = (newOrder:any) => {
      const payload = {
        __metadata:{
          type: `SP.Data.${config.ListNames.Drafts}ListItem`,
      },
      SectionOrder:JSON.stringify(newOrder)

    }
    updateQuery(config.ListNames.Drafts,GetDrafts.data?.value[0].Id,payload,token.data.FormDigestValue)
  }
    const addCell = (DraftId:string) => {
      try {
       const CellData:Changes = {
            Change:uuidv4(),
            Section:uuidv4(),
            Document:GetDrafts.data.value[0].Document,
            Draft:DraftId,
            Content:"",
            CreatedAt:Date(),
            EditedAt:"",
            CurrentCommit:"",
            Classification:"Confidential"
            }
       
       const new_order = [...Order,CellData.Section]
       SaveCells(new_order)
       setOrder(new_order)
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
        Patch:JSON.stringify(DiffPatch?.Patch),
        Diff:DiffPatch?.DiffStr,
        CommitType:"create",
        CommittedAt:Date(),
        User:user?.Id,
        Classification:CellData.Classification
      }
      const CommitPayload = {
        __metadata:{
      type: `SP.Data.${config.ListNames.Commits}ListItem`,
  },
  ...commit
  }
   createQuery(config.ListNames.Commits,CommitPayload,token.data.FormDigestValue)


      return res
   
      } catch (error) {
        console.log(error)
      }    
      




    }

    const  DeleteCell = (ChangeId: string) =>{
      try{
        const deleteCell:Changes = Cells.filter((cell:any) => cell.Change == ChangeId)[0];
        const new_order = Order.filter((Section:any) => Section != deleteCell.Section)
        SaveCells(new_order)
        setOrder(new_order)
        const stage = Staged[ChangeId]
        const DiffPatch = CreateCommit(GetDrafts.data.value[0].Name,stage.original,"")
        const commit = {
            CommitKey:uuidv4(),
            Document:deleteCell.Document,
            Draft:deleteCell.Draft,
            Section:deleteCell.Section,
            Change:deleteCell.Change,
            Patch:JSON.stringify(DiffPatch?.Patch),
            Diff:DiffPatch?.DiffStr,
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
      catch(error){
          console.log(error)
      }
        
    }

    const EditCell = (ChangeId: string,Content:string,type:string ) =>{
      try{

      
        const editedCell = Cells.filter((cell:any) => cell.Change == ChangeId)[0];
        const index = Cells.indexOf(editedCell);
        if (type =="text"){
          editedCell.Content = Content

        }
       else{ 
        editedCell.Classification = Content
      }

        
        editedCell.EditedAt = Date()
        // console.log(editedCell)
        Cells[index]=editedCell;
        if (IsEdited[ChangeId] == undefined){
            const edited:any = {}
            edited[ChangeId] = {Edited:true}
            setIsEdited((prevState:any)=>({...prevState,...edited}))
        }
        const stage:any = Staged[ChangeId]
        if (type =="text"){
                  stage.new_text = Content

        }
        else{
              stage.new_class = Content
              stage.new_text = editedCell.Content

        }

        setStaged((prevState:any)=>({...prevState,...stage}))


        setCells(Cells)

      }
      catch(error){
        console.log(error)
      }
    }



    const filterDataPayload = (data:any) =>{
      try{
        const  {Id,Old_Id,...NewData} = data
        return NewData
      }
      catch(error){
        console.log("filterDataPayload",error)
      }
        
    }
    const FilterEdited = (Cells:ChangesProps) =>{
      try{
        const filtered = Cells.filter((cell) =>  Object.keys(IsEdited).includes(cell.Change))
        return filtered

      }
      catch(error){
        console.log("FilterEdited",error)
      }
        
    }

    const SaveCells = (order:any) =>{
      try{
          const EditedCells = FilterEdited(Cells)

         
          EditedCells?.map((cell:Changes) => {
                const data = filterDataPayload(cell)
                const StagedChanges = Staged[cell.Change]
                const DiffPatch = StagedChanges.original_text != StagedChanges.new_text ? CreateCommit(GetDrafts.data.value[0].Name,StagedChanges.original_text,StagedChanges.new_text) :CreateCommit(GetDrafts.data.value[0].Name,StagedChanges.original_text,StagedChanges.original_text)
                // console.log("original",StagedChanges.original_text,StagedChanges.original_text)
                // console.log("new",StagedChanges.new_text)

                // console.log("DiffPatch",DiffPatch)
                const commit:Commit = {
                  CommitKey:uuidv4(),
                  Document:cell.Document,
                  Draft:cell.Draft,
                  Section:cell.Section,
                  Change:cell.Change,
                  Patch:JSON.stringify(DiffPatch?.Patch),
                  Diff:DiffPatch?.DiffStr,
                  CommitType:"edit",
                  CommittedAt:Date(),
                  User:user?.Id,
                  Classification: StagedChanges.new_class != StagedChanges.old_class? StagedChanges.new_class:StagedChanges.old_class
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
               try{
                // console.log(payload)
                updateQuery(config.ListNames.Changes,cell.Id,payload,token.data.FormDigestValue).then(() => {
                  queryClient.invalidateQueries("Changes")
                }).then(() => {
                  setIsEdited({})
                })

               }
               catch(error){
                console.log("all error",error)
               }

           
             
             


              try {
                createQuery(config.ListNames.Commits,CommitPayload,token.data.FormDigestValue).then(() => {
                  setStaged({})
                })
                
              } catch (error) {
                console.log(error)
              }
                
            })
          changeOrder(order)

        
      }
      catch(error){
        console.log(error)
      }
            

    }
    const  CreateMergeRequest = async () =>{
      const commits = await ReadQuery(constructUrl(config.ListNames.Commits,undefined,undefined,`Draft eq '${params.DraftId}'`))
      const formattedCommits = FormatPatches(groupBy(commits,"Section"))
      const MergeRequestId = uuidv4()

      const Merges = formattedCommits.map((commit:any) => {
        const Merge = {
        Merge:uuidv4(),
        MergeRequest:MergeRequestId,
        ...commit,
        CreatedAt:Date(),
        CreatedBy:user?.Id,
      }
      return Merge
      })
      const MergeIds  = Merges.map((merge:any) => merge.Merge)
      
      const MergeRequest = {
        MergeRequest:MergeRequestId,
        Merges:JSON.stringify(MergeIds),
        Document:Merges[0].Document,
        DocumentName:GetDocument.data.value[0].Name,
        Draft:Merges[0].Draft,
        DraftName:GetDrafts.data.value[0].Name,
        SubmittedBy:user?.Id,
        SubmittedDate:Date(),
        ApporvedBy:null,
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

      

    }


    return ( 
    <div>
    <div className='flex flex-row justify-between items-center'>

    <div className='flex flex-row items-center mt-4 ml-4'>
    <ArrowLeft className='h-10 w-10 text-slate-400 hover:text-slate-900' onClick={()=>navigate(`/category/${GetDrafts.data.value[0].Catergory}`)}></ArrowLeft>
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
            SaveCells(Order)
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
          <Reorder.Group values={Cells} onReorder={(value)=>{
            const reordered = value.map((cell:Sections)=>cell.Section)
            // console.log("reordered keys ",reordered)
            setCells(value)
            setOrder(reordered)
            }}>
        {Cells.map((CellData:Sections) => (
          <Reorder.Item key={CellData.Section} value={CellData}>

            <EditorCell Cellprop={CellData} Delete = {DeleteCell} Edit={EditCell} key={CellData.Section}></EditorCell>
     </Reorder.Item>
            // <MarkdownCell  text={CellData.Content}></MarkdownCell>

        ))}
          </Reorder.Group>

        </div>

        <PlusCircle className='mt-2 text-slate-400 hover:text-slate-500 hover:cursor-pointer' size={32} onClick={()=>{addCell(params.DraftId!)}} />
        </div>


        </div>
        </div>
        

     );
}
 
export default Editor;