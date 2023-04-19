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



import { MoreVertical , X ,User} from "lucide-react"


const OrgansationCard = () => {
    return ( 
        <div>
            <Card className="w-[440px]">
                <CardHeader className="text-lg font-bold">Organization name </CardHeader>
                <CardContent>
                    description
                </CardContent>
                                <CardFooter className="flex flex-row justify-between pr-5">
                    <div className="flex flex-col">
                    <div className="flex flex-row items-center text-slate-500 mt-1">
                        <User className="w-4 h-4 mr-1"></User>
                        <p className="">Owner Name</p>
                    </div>
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
                            Delete Organization 
                            </p>
                            <X className="w-5 h-5  ml-1" />
                            </div>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this Organization 
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-500 hover:bg-red-600">Delete Organization</AlertDialogAction>
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
 
export default OrgansationCard;