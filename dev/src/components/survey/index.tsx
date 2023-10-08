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
import { SurveyForm } from "./surveyFrom"
import { Slider } from "@/components/ui/slider"
import {createQuery} from "@/shared/utils/crud";
import { SurveyType } from "@/shared/types"

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
import { FormInputIcon, Smile } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"

export function Survey() {
    const token = useToken()
    const [OpenSurveyDialog, setOpenSurveyDialog] = useState(false);

    async function handleSubmitFeedBack(surveyData:SurveyType) {
        surveyData.easeOfUse = parseInt(surveyData.easeOfUse as string)
        surveyData.lookAndFeel = parseInt(surveyData.lookAndFeel  as string)
        surveyData.meetNeeds = parseInt(surveyData.meetNeeds  as string)
        surveyData.overall = parseInt(surveyData.overall  as string)
        surveyData.Survey = uuidv4()

        const payload = {
            __metadata: {
                type: "SP.Data.SurveyListItem",
            },
            ...surveyData
    }
    try{
        const res = await createQuery(
            config.ListNames.Survey,
            payload,
            token.data.FormDigestValue)
        console.log(res)
        setOpenSurveyDialog(false)
    }
    catch(err){
        console.log(err)
    }
    
}
  return (
    <Dialog open={OpenSurveyDialog} onOpenChange={setOpenSurveyDialog}>
      <DialogTrigger asChild >
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="">
          <Smile className="w-4 h-4 mr-2"></Smile>
          <span>Feedback From</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Feedback From</DialogTitle>
          <DialogDescription>
            Provide your feedback on the app

          </DialogDescription>
        </DialogHeader>
                  <SurveyForm handleSubmitFeedBack={handleSubmitFeedBack}></SurveyForm>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
