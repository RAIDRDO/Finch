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
import { useNavigate } from "react-router-dom"
import { Survey } from "../survey"
import { BugForm } from "../BugReport/bugFrom"
import { BugReport } from "../BugReport"
const NavBar = () => {
    const navigate = useNavigate()
    return ( 

        <header className="sticky top-0 z-[40] w-full border-b bg-background/95 shadow-sm backdrop-blur">
    <div className="h-14 flex flex-row justify-between mx-20 items-center ">
            <div className="text-lg font-extrabold hover:cursor-pointer" onClick={()=>{
                navigate("/")
            }}>
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
       <p className="font-semibold text-zinc-500 hover:cursor-pointer hover:text-black hover:underline">Submit bug/feedback</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Bug report and Feedback</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
         <Survey></Survey>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
         <BugReport></BugReport>
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