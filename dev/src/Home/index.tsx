// External library imports - utilities before UI components

// Custom imports - hooks, utilities, components, configs, then styles

import ClippedDrawer from "../components/ClippedDrawer"
import DocumentCard from "../components/ui/DocumentCard";
import OrgansationCard from "../components/ui/OrgansationCard";
import MergeItem from "@/components/ui/MergeItem";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import MergeBar from "@/components/ui/MergeBar";
import { Button } from "@/components/ui/button";
import { Plus,GitPullRequest,FilePlus,ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
    <NavBar></NavBar>
    <div>
      <div className="flex flex-col mt-10 mx-20 space-y-12">
        <div className="flex flex-row justify-evenly ">
            <Button className="w-72 h-24 justify-between text-black text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm "> Create Organsation <Plus></Plus></Button> 
            <Button className="w-72 h-24 justify-between text-black text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm "> Create Document <FilePlus></FilePlus></Button> 
            <Button className="w-72 h-24 justify-between text-black  text-base font-semibold bg-white hover:bg-slate-100 border shadow-sm "> Review Merge Request <GitPullRequest></GitPullRequest></Button> 
        </div>
        <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Recent Documents</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400">
                View All 
                <ArrowRight className="ml-2"></ArrowRight>
              </Button>
            </div>
            <div className="border"></div>
            <div className="flex flex-row justify-evenly">
              <DocumentCard></DocumentCard>
              <DocumentCard></DocumentCard>
              <DocumentCard></DocumentCard>
              <DocumentCard></DocumentCard>
            </div>
        </div>
         <div className="flex flex-col space-y-4">
            <div className="flex flex-row justify-between">
              <p className="font-bold text-xl">Organizations</p>
              <Button className="bg-white text-slate-300 hover:bg-white hover:text-slate-400">
                View All 
                <ArrowRight className="ml-2"></ArrowRight>
              </Button>
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