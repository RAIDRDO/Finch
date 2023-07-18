import { Button } from "@/components/ui/button"
import { XSquare,CheckSquare } from "lucide-react"
const MergeBar  = () => {
    return ( 
        <header className="sticky top-0 z-[40] w-full border-b bg-background/95 shadow-sm backdrop-blur">
            <div className="container flex flex-row justify-end items-center p-2 space-x-3">
                <div>
                    <Button className="bg-red-500 hover:bg-red-600 items-center align-middle">
                            <p>Reject Merge</p> 
                            <XSquare className="w-5 h-5 ml-2 mt-[2.5px]"></XSquare>
                    </Button>
                </div>
                 <div>
                    <Button className="bg-green-500 hover:bg-green-600 items-center align-middle">
                            <p>Approve Merge</p> 
                            <XSquare className="w-5 h-5 ml-2 mt-[2.5px]"></XSquare>
                    </Button>
                </div>
            </div>
        </header>
     );
}
 
export default MergeBar ;