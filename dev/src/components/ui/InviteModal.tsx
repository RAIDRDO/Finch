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
const InviteModal = () => {
    const [Permission, setPermission] = useState("Viewer");

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
  <DialogContent className="p-8 ">
    <DialogHeader>
      <DialogTitle>Share ... </DialogTitle>
      <DialogDescription>
       invite users to this ... and manage their permissions
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-row space-x-2">
        <Input placeholder="Add people" />
        <Button>Add</Button>


    </div>
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
 
export default InviteModal;