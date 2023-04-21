// External library imports - utilities before UI components

// Custom imports - hooks, utilities, components, configs, then styles

import ClippedDrawer from "../../components/ClippedDrawer"
import DocumentCard from "../../components/ui/DocumentCard";
import OrgansationCard from "../../components/ui/OrgansationCard";
import MergeItem from "@/components/ui/MergeItem";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import MergeBar from "@/components/ui/MergeBar";
import { Button } from "@/components/ui/button";
import { Plus,GitPullRequest,FilePlus,ArrowRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export default function Organizations() {
  return (
    <>
    <NavBar></NavBar>
    <div>
      <div className="flex flex-col mt-10 mx-20 space-y-12">
         <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Organizations</p>

                 <Dialog>
      <DialogTrigger asChild>
            <Button className="">
                Add Organization 
                <Plus className="ml-2"></Plus>
              </Button>      
        </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>                Add Organization </DialogTitle>
          <DialogDescription>
            Type in your new organization name and click create .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="organization_name" className="text-right">
              Organization Name
            </Label>
            <Input id="organization_name" value="Pedro Duarte" className="col-span-3" />
          </div>
        
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly">
              <OrgansationCard></OrgansationCard>
              <OrgansationCard></OrgansationCard>
              <OrgansationCard></OrgansationCard>

            </div>
        </div>

       
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}