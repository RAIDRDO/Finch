import React, { useState } from 'react';
import EditorCell from "@/components/ui/EditorCell";
import {CellProps,Sections} from '@/shared/types' 
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
import { constructReadQueryFn, constructUrl, createQuery ,deleteQuery,updateQuery} from "@/shared/utils/crud";
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import useToken from "@/shared/utils/crud/useToken";
import CryptoJS from 'crypto-js';


interface IsEdited{
    Edited?:boolean
}

interface IsEditeds extends Array<IsEdited>{}

const Editor = () => {
    const token = useToken()
    const navigate = useNavigate()
    const params = useParams();
    const queryClient = useQueryClient()
    const [Cells, setCells] = useState<CellProps>([]);
    const [IsEdited, setIsEdited] = useState<any>({});
    const GetDocuments = useQuery({queryKey:["Documents"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Documents,undefined,undefined,`Document eq '${params.DocId}'`))})
    const GetSections = useQuery({queryKey:["Sections"]
    ,queryFn:constructReadQueryFn(constructUrl(config.ListNames.Sections,undefined,undefined,`Document eq '${params.DocId}'`))
  ,onSuccess(data) {
      setCells(data)
  }
  },)

    const addCell = (DocId:string) => {
        SaveCells()
        const CellData:Sections = {
            Section:uuidv4(),
            Document:DocId,
            Content:"",
            CreatedAt:Date(),
            EditedAt:"",
            }
        const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Sections}ListItem`,

    },
      
      ...CellData
      }
      const res = createQuery(config.ListNames.Sections,payload,token.data.FormDigestValue).then((res) => {
        queryClient.invalidateQueries("Sections")
        return res
      })
      try {
        
        return res
      } catch (error) {
        console.log(error)
      }        
    }

    const  DeleteCell = (SectionId: string) =>{
        SaveCells()
        const deleteCell:Sections = Cells.filter((cell) => cell.Section == SectionId)[0];
        deleteQuery(config.ListNames.Sections,deleteCell.Id!,token.data.FormDigestValue).then(() => {
        queryClient.invalidateQueries("Sections")
        })
        
    }

    const EditCell = (SectionId: string,Content:string ) =>{
        const editedCell = Cells.filter((cell) => cell.Section == SectionId)[0];
        const index = Cells.indexOf(editedCell);
        editedCell.Content = Content
        editedCell.EditedAt = Date()
        Cells[index]=editedCell;
        if (IsEdited[SectionId] == undefined){
            const edited:any = {}
            edited[SectionId] = {Edited:true}
            setIsEdited((prevState:any)=>({...prevState,...edited}))
        }


        setCells(Cells)
    }
    const filterDataPayload = (data:any) =>{
        const  {Id,Old_Id,...NewData} = data
        return NewData
    }
    const FilterEdited = (Cells:CellProps) =>{
        const filtered = Cells.filter((cell) =>  Object.keys(IsEdited).includes(cell.Section))
        return filtered
    }

    const SaveCells = () =>{
            const EditedCells = FilterEdited(Cells)
            EditedCells.map((cell:Sections) => {
                const data = filterDataPayload(cell)
                const payload = {
                    __metadata:{
                 type: `SP.Data.${config.ListNames.Sections}ListItem`,
             
             },
               
               ...data
               }
               updateQuery(config.ListNames.Sections,cell.Id,payload,token.data.FormDigestValue).then(() => {
                queryClient.invalidateQueries("Sections")
              }).then(() => {
                setIsEdited({})
              })
              try {
                
              } catch (error) {
                console.log(error)
              }
                
            })

    }


    return ( 
    <div>
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
   
        <div className="flex flex-row justify-center">
        <div className='flex flex-col w-9/12  items-center'>
        <div className="flex flex-col w-9/12 h-full bg-slate-50">
        {Cells.map((CellData:Sections) => (
            <EditorCell Cellprop={CellData} Delete = {DeleteCell} Edit={EditCell} key={CellData.Section}></EditorCell>
        ))}
        </div>

        <PlusCircle className='mt-2 text-slate-400 hover:text-slate-500 hover:cursor-pointer' size={32} onClick={()=>{addCell(params.DocId!)}} />
        </div>


        </div>
        </div>
        

     );
}
 
export default Editor;