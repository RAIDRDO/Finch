import React, { useState } from 'react';
import EditorCell from "@/components/ui/EditorCell";
import {CellProps,Sections} from '@/shared/types' 
import { PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';



const Editor = () => {
    const [Cells, setCells] = useState<CellProps>([{Section:uuidv4(),Document:uuidv4(),Content:"",CreatedAt:Date(),EditedAt:""}]);
    

    const addCell = () => {
        console.log("add cell")
        const CellData:Sections = {
            Section:uuidv4(),
            Document:uuidv4(),
            Content:"",
            CreatedAt:Date(),
            EditedAt:"",
            }
        setCells([...Cells, CellData])
    }

    const  DeleteCell = (SectionId: string) =>{
        const newCells = Cells.filter((cell) => cell.Section !== SectionId);
        setCells(newCells);

    }

    const EditCell = (SectionId: string,Content:string ) =>{
        console.log("edit cell")
        const editedCell = Cells.filter((cell) => cell.Section == SectionId)[0];
        const index = Cells.indexOf(editedCell);
        editedCell.Content = Content
        editedCell.EditedAt = Date()
        Cells[index]=editedCell;
        setCells(Cells)
        console.log(Cells)
    }


    return ( 
        <div className="flex flex-row justify-center">
        <div className='flex flex-col w-9/12  items-center'>
        <div className="flex flex-col w-9/12 h-full bg-slate-50">
        {Cells.map((CellData:Sections) => (
            <EditorCell Cellprop={CellData} Delete = {DeleteCell} Edit={EditCell} key={CellData.Section}></EditorCell>
        ))}
        </div>

        <PlusCircle className='mt-2 text-slate-400 hover:text-slate-500 hover:cursor-pointer' size={32} onClick={()=>{addCell()}} />
        </div>


        </div>

     );
}
 
export default Editor;