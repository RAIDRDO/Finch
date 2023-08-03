import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "./input";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

import { Button } from "./button";

import { Pencil } from "lucide-react";

import { useState } from "react";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { constructReadQueryFn, constructUrl, createQuery,addPermission,ReadQuery, updateQuery, deleteQuery,composeEmail} from "@/shared/utils/crud";

import {config} from "@/config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { X ,Undo} from "lucide-react";

import { useForm, SubmitHandler } from "react-hook-form"
import useToken from "@/shared/utils/crud/useToken";
import { useQuery,useQueryClient } from "react-query";

async function emailExist(email:string) {

  const url = `${config.apiUrl}web/SiteUsers?` +  `&$filter=` +  `Email eq `+ `'${email.trim()}'`
  const res = await ReadQuery(url)
  if (res.length > 0) {
    return true
  }
  else{
  return false
  }
}


async function onSubmit (email:string,permission:string,type:string,token:string,resourceId:number,resourceUUID:string,resourceName:string) {
  const url = `${config.apiUrl}web/SiteUsers?` +  `&$filter=` +  `Email eq `+ `'${email.trim()}'`
  const res = await ReadQuery(url)
  let resource = ""
  switch (type) {
    case "Org":
      resource = "organization"
      break;
    case "Cat":
      resource = "category"
      break;
    case "Doc":
      resource = "document"
      break;
  }
  const role = type +"-"+permission
  // console.log(role)
  addPermission(token,resourceUUID,resourceId,res[0].Id,email,resource,role)?.then(()=>{
  composeEmail(token,type,"grant",res[0].Id,resourceUUID,resourceName)})


  
  
}



const InviteModal = ({type,resourceId,resourceUUID,resourceName}:{type:string,resourceId:number,resourceUUID:string,resourceName:string}) => {
  const token = useToken()
  const queryClient = useQueryClient()

  const getPermissions = useQuery({queryKey:["Resource_Permissions"],queryFn:constructReadQueryFn(constructUrl(config.ListNames.Permissions,undefined,undefined,`Resource eq '${resourceUUID}'`))})
  // console.log(getPermissions.data)
  const formSchema = z.object({
  email: z.string({
      required_error: "Please select an email to display.",
    }).email("This is not a valid email.").refine(async (email) => {
    return (await emailExist(email))
  },"This email is not in our database"),
  permission: z.string().nonempty(),
})
    const [Permission, setPermission] = useState("Viewer");
    const [EditedPermissions, setEditedPermissions] = useState<any>({});
    const [DeletedPermissions, setDeletedPermissions] = useState<any>({});

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })



async function savePermissions (new_permissions:any,deleted_permissions:any,token:string) {
  if (Object.keys(new_permissions).length > 0) {
  Object.keys(new_permissions).forEach(async (new_permission:any) => {
         const payload = {
                    __metadata:{
                 type: `SP.Data.${config.ListNames.Permissions}ListItem`,
             
             },
               
               Role: new_permissions[new_permission].Role
      }

      updateQuery(config.ListNames.Permissions,new_permissions[new_permission].Id,payload,token)


  }
  )
   setEditedPermissions({})
    queryClient.invalidateQueries("Resource_Permissions")  
  }

  else if (Object.keys(deleted_permissions).length > 0){
    Object.keys(deleted_permissions).forEach(async (deleted_permission:any) => {
      deleteQuery(config.ListNames.Permissions,deleted_permissions[deleted_permission].Id,token)
    }
    )
    setDeletedPermissions({})
          queryClient.invalidateQueries("Resource_Permissions")
  }
}

    return ( 
<Dialog>
  <DialogTrigger>

    <div className="flex flex-row justify-between items-center p-4 hover:bg-blue-200 hover:text-blue-500 hover:cursor-pointer">
                            <p className="">
                            Edit Permissions  
                            </p>
                            <Pencil className="w-5 h-5  ml-1"></Pencil>
                            </div>
  </DialogTrigger>
  <DialogContent className="p-8">
    <DialogHeader>
      <DialogTitle>Share  
         {{
            "Org": " Organization",
            "Cat": " Category",
            "Doc": " Document",
            

         }[type]}
        
        </DialogTitle>
      <DialogDescription>
       Invite users to this {{
            "Org": " Organization",
            "Cat": " Category",
            "Doc": " Document",
            

         }[type]} and manage their permissions
      </DialogDescription>
    </DialogHeader>
      <Form {...form}>
      <form className="flex flex-row space-x-2" onSubmit={form.handleSubmit(
        e => {
        // console.log(form.getValues())
        onSubmit(form.getValues().email,form.getValues().permission,type,token.data.FormDigestValue,resourceId,resourceUUID,resourceName)
       }
      )}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Add people" {...field} />
              </FormControl>         
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="permission"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                 <FormControl>
                   <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Permission" />
                </SelectTrigger>
              </FormControl>      
             
              <SelectContent>
                <SelectItem value="Viewer">Viewer</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Contributor">Contributor</SelectItem>
              </SelectContent>
            </Select>
                
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>


    <div>
        <p className="font-semibold">
            People with access
        </p>
        
        <div className="flex flex-col mt-4 space-y-4">
        {
          getPermissions.data?.value.map((permission:any) => (
            // console.log(permission.Role.split("-")[1]),
          <div className="flex flex-row justify-between" key={permission.Permission}>
        <div className="flex flex-row space-x-2 items-center">
        <div>
        <Avatar className="hover:cursor-pointer hover:ring-offset-2 ring-2 ">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        </Avatar>

            </div>
            { DeletedPermissions[permission.Permission] == undefined ?
            
                   <div className="flex flex-col">
                <p className="font-semibold"> username</p>
                <p className="text-sm">{permission.Email}</p>
            </div>
            :
                <div className="flex flex-col">
                <p className="font-semibold line-through"> username</p>
                <p className="text-sm line-through">{permission.Email}</p>
            </div>
    
          }

       
        
        </div>
        <div className="flex flex-row items-center space-x-4">
          <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={permission.Role.split("-")[1] =="Owner" || DeletedPermissions[permission.Permission] != undefined ?true:false} >

                <div className="flex flex-row rounded-sm p-2 justify-between items-center hover:bg-slate-200 hover:cursor-pointer">
                         {DeletedPermissions[permission.Permission] == undefined?
                                                 <p className="font-semibold text-sm">{EditedPermissions[permission.Permission] == undefined?permission.Role.split("-")[1] :EditedPermissions[permission.Permission].Role.split("-")[1]}</p>

                         :
                        <p className="font-semibold text-sm text-red-500">removed</p>

                         }
                </div>

                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[150px]">
        <DropdownMenuLabel>Permissions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={EditedPermissions[permission.Permission] == undefined?permission.Role.split("-")[1] :EditedPermissions[permission.Permission].Role.split("-")[1]} onValueChange={(e)=>
          {
            const new_role = type+"-"+e
            // console.log("new role",new_role)
            // console.log("old role",permission.Role)
            const new_permission = Object.assign({},permission)
            new_permission.Role = new_role
            if (permission.Role == new_permission.Role){
              delete EditedPermissions[permission.Permission]
              setEditedPermissions(
              {
                ...EditedPermissions
              }
            )
            }
            else{
              setEditedPermissions(
              {
                ...EditedPermissions,
                [new_permission.Permission]:new_permission
              }
            )
            }
           
            
            // console.log("EDITED PERM",EditedPermissions)
          }}>
          <DropdownMenuRadioItem value="Viewer">Viewer</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Editor">Editor</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Contributor">Contributor</DropdownMenuRadioItem>

        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

            </DropdownMenu>
             <Button className="bg-transparent hover:bg-transparent" disabled={permission.Role.split("-")[1] =="Owner"?true:false}>
          {
            DeletedPermissions[permission.Permission] == undefined?
              <X className="h-6 w-6 text-slate-300 hover:text-red-500 hover:cursor-pointer" onClick={()=>{
            if (EditedPermissions[permission.Permission] != undefined){
            const edited = EditedPermissions[permission.Permission]
            setDeletedPermissions(
              {
                ...DeletedPermissions,
                [edited.Permission]:edited
              }
            )
          }
          else{
            setDeletedPermissions(
              {
                ...DeletedPermissions,
                [permission.Permission]:permission
              }
            )
          }

            delete EditedPermissions[permission.Permission]
            setEditedPermissions(
              {
                ...EditedPermissions
              }
            )
            
          }}></X>
          :
          <Undo className="h-6 w-6 text-slate-300 hover:text-green-500 hover:cursor-pointer" 
          onClick={()=>{
            const previous = DeletedPermissions[permission.Permission]
            if (permission.Role != previous.Role){
            setEditedPermissions(
              {
                ...EditedPermissions,
                [previous.Permission]:previous

              }
            )
            }
            
            delete DeletedPermissions[permission.Permission]
            setDeletedPermissions(
              {
                ...DeletedPermissions,
              }
            )

            
            
          }}
          ></Undo>
          }
        

          </Button>
        </div>
            
      

        
         
        </div>
          ))

        }

        

        </div>
        
       
    </div>
    <div className="flex flex-row justify-end items-end space-x-8">
      {Object.keys(EditedPermissions).length > 0 || Object.keys(DeletedPermissions).length > 0?
            <p className="text-sm">pending changes...</p>

      :
      null}
      <Button className="" disabled={Object.keys(EditedPermissions).length > 0 || Object.keys(DeletedPermissions).length > 0 ?false:true} onClick={()=>savePermissions(EditedPermissions,DeletedPermissions,token.data.FormDigestValue)}>Save</Button>
    </div>
  </DialogContent>
</Dialog>

     );
}
 
export default InviteModal