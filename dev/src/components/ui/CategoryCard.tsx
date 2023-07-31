import { config } from "@/config";

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

import {Catergory} from "@/shared/types"
import { useQuery ,useQueryClient} from "react-query";
import useToken from "@/shared/utils/crud/useToken";
import { deleteQuery,CascadeDelete } from "@/shared/utils/crud"
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import InviteModal from "./InviteModal";
import {ResolvePermissions} from "@/shared/utils/crud/helper"
import { useToast } from "@/components/ui/use-toast"

interface CatergoryProps extends Catergory {
  Role: string;
}


const CategoryCard = ({Id,Cat,Name,Org,Owner,Role}:CatergoryProps) => {
    const token = useToken()
    const {toast} = useToast()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const permissions = ResolvePermissions(Role)
    const CanDelete = (permissions.CatOwner || permissions.CatContributor)
    const CanEditPerm = (permissions.CatOwner || permissions.CatContributor)
    const  Delete = (Id: number) =>{
        deleteQuery(config.ListNames.Catergory,Id,token.data.FormDigestValue).then(() => {
        queryClient.invalidateQueries("Catergories")
        }).then(() => {
          CascadeDelete(token.data.FormDigestValue,Cat,"CAT").then(() => {
            queryClient.invalidateQueries({queryKey: ["Documents"]})
            queryClient.invalidateQueries({queryKey: ["Catergories"]})

          })

        })
        
    }
    return ( 
        <div>
            <Card className="w-[440px]">
                <CardHeader className="text-lg font-bold hover:cursor-pointer hover:underline" onClick={permissions.OrgViewer===false ?()=>toast({
          title: "No Permission",
          description: `You do not have permission to view this organisation.`,
          variant: "destructive"
                                }):
                                ()=>navigate(`/category/${Cat}`)
                              
                              }>{Name}</CardHeader>
                <CardContent  className="hover:cursor-pointer" onClick={permissions.OrgViewer===false ?()=>toast({
          title: "No Permission",
          description: `You do not have permission to view this organisation.`,
          variant: "destructive"
                                }):
                                ()=>navigate(`/category/${Cat}`)
                              
                              }>
                </CardContent>
                                <CardFooter className="flex flex-row justify-between pr-5">
                    <div className="flex flex-col">
                    <div className="flex flex-row items-center text-slate-500 mt-1">
                        <User className="w-4 h-4 mr-1"></User>
                        <p className="">{Owner}</p>
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
                        <PopoverContent className="w-auto  px-0 ">

<div className="flex flex-col">
{CanEditPerm ? <InviteModal type={"Cat"} resourceId={Id!} resourceUUID={Cat!}></InviteModal>
:<div className="flex flex-row items-center p-4 hover:bg-blue-200 hover:text-blue-500 hover:cursor-pointer">
<p className="">
Request permission 
</p>
</div>}

{CanDelete ? 
<AlertDialog>
  <AlertDialogTrigger>
        <div className="flex flex-row items-center p-4 hover:bg-rose-200 hover:text-red-500 hover:cursor-pointer">
                            <p className="">
                            Delete Category 
                            </p>
                            <X className="w-5 h-5  ml-1" />
                            </div>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this Category 
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={()=>Delete(Id!)}>Delete Category</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog> : null}


</div>


                      
                        </PopoverContent>
                    </Popover>
                   
          
                </CardFooter>
            </Card>

        </div>
     );
}
 
export default CategoryCard;