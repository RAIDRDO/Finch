import { Button } from "@/components/ui/button"
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
import { BugForm } from "./bugFrom"
import { Slider } from "@/components/ui/slider"
import {createQuery} from "@/shared/utils/crud";
import { BugType } from "@/shared/types"

import { config } from "@/config"
import useToken from "@/shared/utils/crud/useToken";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bug, FormInputIcon, Smile } from "lucide-react"

export function BugReport() {
    const token = useToken()
    const [OpenBugReportDialog, setOpenBugReportDialog] = useState(false);

    async function handleSubmitBugReport(BugData:BugType) {
       
        BugData.Bug = uuidv4()

        const payload = {
            __metadata: {
                type: "SP.Data.BugReportListItem",
            },
            ...BugData
    }
    try{
        const res = await createQuery(
            config.ListNames.BugReport,
            payload,
            token.data.FormDigestValue)
        console.log(res)
        setOpenBugReportDialog(false)
    }
    catch(err){
        console.log(err)
    }
    
}
  return (
    <Dialog open={OpenBugReportDialog} onOpenChange={setOpenBugReportDialog}>
      <DialogTrigger asChild >
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="">
          <Bug className="w-4 h-4 mr-2"></Bug>
          <span>Bug Report</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bug Report</DialogTitle>
          <DialogDescription>
            Provide a detailed description of the bug you encountered

          </DialogDescription>
        </DialogHeader>
        <BugForm handleSubmitBugReport={handleSubmitBugReport}></BugForm>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
