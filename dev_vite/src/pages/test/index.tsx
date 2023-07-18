import * as React from "react"
import { useState,useEffect,useMemo } from "react"
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
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import SimpleMDE from "easymde";


import ReactDOMServer from "react-dom/server";
import ReactMarkdown from 'react-markdown'

type Checked = DropdownMenuCheckboxItemProps["checked"]

const Test = () => {
    const [Editortxt, setEditortxt] = useState();
    const customRendererOptions = useMemo(() => {
    return {
            previewRender(text:any) {
        return ReactDOMServer.renderToString(
          <ReactMarkdown
            children={text}
          />
        );
      },
    } as SimpleMDE.Options;
  }, []);
    return ( 
        <div>
              

         <SimpleMdeReact  options={customRendererOptions} value={Editortxt}  onChange={(e:any)=>{setEditortxt(e)} } />
 
        </div>
     );
}
 
export default Test;