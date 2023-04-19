import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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


import { MoreVertical , X ,Pencil} from "lucide-react"

const MergeItem = () => {
    return ( 
        <div className="flex flex-row justify-evenly items-center rounded h-[75px] w-[1300px] bg-slate-100 shadow">
            <div>
                Document name
            </div>
            <div>
                Document name
            </div>
            <div>
                 Document name
            </div>
            <div>
                 Document name
            </div>
            <div>
                 Document name
            </div>
            <div>
                 Document name
            </div>
            <div>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                        Review Changes <Pencil className="w-4 h-4 ml-2"></Pencil>

                    </Button>
            </div>
        </div>
     );
}
 
export default MergeItem;