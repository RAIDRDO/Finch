import * as React from "react"
import { useState,useEffect } from "react"
import { ChevronsUpDown , MoreHorizontal ,X} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { Button } from "@/components/ui/button"

import { Textarea } from "@/components/ui/textarea"
import {Sections} from '@/shared/types' 

type Checked = DropdownMenuCheckboxItemProps["checked"]

const EditorCell = ({Cellprop,Delete,Edit}:any) => {
    const [Classification, setClassification] = useState("");
    console.log("rendered")

    return ( 
        <div className="flex flex-col border shadow-sm rounded-sm">
            <div className=" p-4 flex flex-row justify-between">

                <DropdownMenu>
                <DropdownMenuTrigger asChild>

                <div className="flex flex-row rounded-sm  w-[150px] p-2 justify-between items-center hover:bg-slate-200 hover:cursor-pointer">
                        <p className="font-semibold">Classification</p>
                        <ChevronsUpDown className="ml-1 h-5 w-5"></ChevronsUpDown>
                </div>

                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[150px]">
        <DropdownMenuLabel>Classification type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={Classification} onValueChange={setClassification}>
          <DropdownMenuRadioItem value="Open">Open</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Restricted">Restricted</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Confidential">Confidential</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Secret">Secret</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Top Secret">Top Secret</DropdownMenuRadioItem>

        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

            </DropdownMenu>


             <Popover>
                        <PopoverTrigger asChild>
                            <div className="p-2 rounded-full hover:bg-slate-200 hover:cursor-pointer">
                                <MoreHorizontal className="w-54 h-6  text-slate-600" />
                            </div>
    
                        </PopoverTrigger>
                        <PopoverContent className="w-auto flex flex-col px-0 ">



        <div className="flex flex-row items-center p-4 hover:bg-rose-200 hover:text-red-500 hover:cursor-pointer" onClick={()=>Delete(Cellprop.Section)}>
                            <p className="">
                            Delete Cell 
                            </p>
                            <X className="w-5 h-5  ml-1" />
                            </div>
 
                      
                        </PopoverContent>
                    </Popover>
                   
              
         </div>
         <Textarea placeholder="Type your text here."  onChange={(e)=>{Edit(Cellprop.Section,e.target.value)}} />
 
        </div>
     );
}
 
export default EditorCell;