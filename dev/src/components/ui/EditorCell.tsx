import * as React from "react"
import { useState,useEffect,useMemo } from "react"
import { ChevronsUpDown , Eye, MoreHorizontal ,X,GripVertical} from "lucide-react";
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
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import SimpleMDE from "easymde";
import { Switch } from "./switch";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from 'remark-gfm'

import ReactDOMServer from "react-dom/server";
import ReactMarkdown from 'react-markdown'
import remarkMermaid from "@/lib/remark-mermaid-v2";
import MarkdownRendrer from "./MarkdownRenderer";
import { Toggle } from "./toggle";

type Checked = DropdownMenuCheckboxItemProps["checked"]

const EditorCell = ({Cellprop,Delete,Edit,Controls}:any) => {

    const [IsEdit, setIsEdit] = useState<boolean>(false);
    const [viewOnly, setviewOnly] = useState<boolean>(false);
    const [Classification, setClassification] = useState("");
    useEffect(() => {
        if (Cellprop.Content == "") {
            setIsEdit(true);
        }
        else{
            setIsEdit(false);

        }
    }, [])

    const customRendererOptions = useMemo(() => {
    return {
            previewRender(text:string) {
        return ReactDOMServer.renderToString(
              
                <MarkdownRendrer text={text}></MarkdownRendrer>

    
        );
      },
    } as SimpleMDE.Options;
  }, []);
    return ( 
      <>
       {IsEdit? 
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
            <div className="flex flex-row items-center">
              <Button className="bg-transparent hover:bg-transparent text-slate-500 hover:text-slate-700" onClick={
                ()=>{setIsEdit(false)}
              }>
                render 
              <Eye className="ml-2"></Eye>
              </Button>

  <Popover>
                        <PopoverTrigger asChild>
                            <div className="p-2 rounded-full hover:bg-slate-200 hover:cursor-pointer">
                                <MoreHorizontal className="w-54 h-6  text-slate-600" />
                            </div>
    
                        </PopoverTrigger>
                        <PopoverContent className="w-auto flex flex-col px-0 ">


        
        <div className="flex flex-row items-center p-4 hover:bg-rose-200 hover:text-red-500 hover:cursor-pointer" onClick={()=>Delete(Cellprop.Change)}>
                            <p className="">
                            Delete Cell 
                            </p>
                            <X className="w-5 h-5  ml-1" />
                            </div>
 
                      
                        </PopoverContent>
                    </Popover>
                   
                  <GripVertical className=" text-slate-300 hover:text-slate-600 hover:cursor-pointer"  onPointerDown={(e) => Controls.start(e)}
></GripVertical>
            
            </div>
          
              
         </div>

         <SimpleMdeReact options={customRendererOptions} value={Cellprop.Content}  onChange={(e:any)=>{Edit(Cellprop.Change,e)}}  />
 
        </div>
         : 
        
        <div className="flex flex-col hover:rounded-sm bg-white hover:border hover:border-blue-300" onClick={(e:any)=>{
          if (e.detail===2){
            setIsEdit(true);
          }
        }}>
            <MarkdownRendrer  text={Cellprop.Content}></MarkdownRendrer>
        </div>
        }

      </>
       
        
     );
}
 
export default EditorCell;