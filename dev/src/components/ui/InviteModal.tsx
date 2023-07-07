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
import { constructReadQueryFn, constructUrl, createQuery,addPermission,ReadQuery} from "@/shared/utils/crud";

import {config} from "@/config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useForm, SubmitHandler } from "react-hook-form"
import useToken from "@/shared/utils/crud/useToken";

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


async function onSubmit (email:string,permission:string,type:string,token:string,resourceId:number,resourceUUID:string) {
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
  console.log(role)
  addPermission(token,resourceUUID,resourceId,res[0].Id,email,resource,role)



  
  
}

const InviteModal = ({type,resourceId,resourceUUID}:{type:string,resourceId:number,resourceUUID:string}) => {
  const token = useToken()
  const formSchema = z.object({
  email: z.string({
      required_error: "Please select an email to display.",
    }).email("This is not a valid email.").refine(async (email) => {
    return (await emailExist(email))
  },"This email is not in our database"),
  permission: z.string().nonempty(),
})
    const [Permission, setPermission] = useState("Viewer");

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
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
        console.log(form.getValues())
        onSubmit(form.getValues().email,form.getValues().permission,type,token.data.FormDigestValue,resourceId,resourceUUID)
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
        <div className="flex flex-col mt-4">
        <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-4 items-center">
        <div>
        <Avatar className="hover:cursor-pointer hover:ring-offset-2 ring-2 ">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        </Avatar>

            </div>
            <div className="flex flex-col">
                <p className="font-semibold"> username</p>
                <p className="text-sm">email@email.com</p>
            </div>
    
        </div>
                 <DropdownMenu>
                <DropdownMenuTrigger asChild>

                <div className="flex flex-row rounded-sm p-2 justify-between items-center hover:bg-slate-200 hover:cursor-pointer">
                        <p className="font-semibold text-sm">{Permission}</p>
                </div>

                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[150px]">
        <DropdownMenuLabel>Permissions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={Permission} onValueChange={setPermission}>
          <DropdownMenuRadioItem value="Viewer">Viewer</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Editor">Editor</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Contributor">Contributor</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>

            </DropdownMenu>

        </div>

        </div>
       
    </div>
  </DialogContent>
</Dialog>

     );
}
 
export default InviteModal