import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search,User } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NavBar = () => {
    return ( 

        <header className="sticky top-0 z-[40] w-full border-b bg-background/95 shadow-sm backdrop-blur">
    <div className="h-14 flex flex-row justify-between mx-20 items-center ">
            <div className="text-lg font-extrabold">
                Finch
            </div>

            <div className="flex items-center space-x-2">
                <Input className="w-[600px] h-10" placeholder="Search..." >
                </Input>
                <Button type="submit">
                    <Search className="w-4 h-4"></Search>
                </Button>

            </div>

    <div >
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:cursor-pointer hover:ring-offset-2 ring-2 ">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>


            </div>
        </div>
        </header>
       
     );
}
 
export default NavBar;