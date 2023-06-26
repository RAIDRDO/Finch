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


import { Organisation} from "@/shared/types"
import { useQuery ,useQueryClient} from "react-query";
import useToken from "@/shared/utils/crud/useToken";
import { deleteQuery,CascadeDelete } from "@/shared/utils/crud"
import { useNavigate, useLocation ,useParams} from "react-router-dom";
import InviteModal from "./InviteModal";

import {ResolvePermissions} from "@/shared/utils/crud/helper"

interface OrganisationProps extends Organisation {
  Role: string;
}

const OrgansationCard = ({Id,org,name,desc,owner,Role}:OrganisationProps) => {
      const token = useToken()
    const permissions = ResolvePermissions(Role)
    const queryClient = useQueryClient()
      const navigate = useNavigate()
    


    const CanDelete = (permissions.OrgOwner || permissions.OrgContributor)
    const CanEditPerm = (permissions.OrgOwner || permissions.OrgContributor)

    const  Delete = (Id: number) =>{
        deleteQuery(config.ListNames.Organisation,Id,token.data.FormDigestValue).then(() => {
        queryClient.invalidateQueries("Orgnisations")
        }).then(() => {
          CascadeDelete(token.data.FormDigestValue,org,"ORG").then(() => {
            queryClient.invalidateQueries({queryKey: ["Documents"]})
            queryClient.invalidateQueries({queryKey: ["Catergories"]})

          })

        })
        
    }
    return ( 
        <div>
            <Card className="w-[440px]">
                <CardHeader className="text-lg font-bold hover:cursor-pointer hover:underline" onClick={()=>navigate(`/organization/${org}`)}>{name}</CardHeader>
                <CardContent className="hover:cursor-pointer" onClick={()=>navigate(`/organization/${org}`)}>
                    {desc}
                </CardContent>
                                <CardFooter className="flex flex-row justify-between pr-5">
                    <div className="flex flex-col">
                    <div className="flex flex-row items-center text-slate-500 mt-1">
                        <User className="w-4 h-4 mr-1"></User>
                        <p className="">{owner}</p>
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

{CanEditPerm ? <InviteModal></InviteModal>
:<div className="flex flex-row items-center p-4 hover:bg-blue-200 hover:text-blue-500 hover:cursor-pointer">
<p className="">
Request permission 
</p>
</div>}

{CanDelete ? <AlertDialog>
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
      <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={()=>Delete(Id!)}>Delete Organization</AlertDialogAction>
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
 
export default OrgansationCard;