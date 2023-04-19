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

import { MoreVertical , X } from "lucide-react"

import { cn } from "@/lib/utils"

const DocumentCard = () => {
    return ( 
        <div>
            {/* <div className="h-80 w-80 border-slate-300 bg-slate-100 rounded-sm shadow">
                <div className="flex flex-col justify-center items-center h-full">
                    
                </div>
            </div> */}
            <Card className="w-[270px]">
                <CardContent>
                    <div className="w-[200px] h-[200px]">
                        
                    </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-between px-5">
                    <div className="flex flex-col">
                    <h1 className="text-base font-bold">title</h1>
                    <p className="text-sm">description</p>
                    </div>
                    <div>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="p-2 rounded-full hover:bg-slate-200 hover:cursor-pointer">
                                <MoreVertical className="w-54 h-6  text-slate-600" />
                            </div>
    
                        </PopoverTrigger>
                        <PopoverContent className="w-auto flex flex-col px-0 ">


<AlertDialog>
  <AlertDialogTrigger>
        <div className="flex flex-row items-center p-4 hover:bg-rose-200 hover:text-red-500 hover:cursor-pointer">
                            <p className="">
                            Delete Document 
                            </p>
                            <X className="w-5 h-5  ml-1" />
                            </div>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this document
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-500 hover:bg-red-600">Delete Document</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                      
                        </PopoverContent>
                    </Popover>
                   
          
                </CardFooter>
            </Card>

            
        </div>
     );
}
 
export default DocumentCard;