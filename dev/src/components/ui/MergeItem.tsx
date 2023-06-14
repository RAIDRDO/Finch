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

import { Button } from "@/components/ui/button"
import { constructReadQueryFn, constructUrl, createQuery ,deleteQuery,updateQuery,ReadQuery} from "@/shared/utils/crud";

import { groupBy,FormatPatches } from '@/shared/utils/crud/helper';
import { AuthContext } from "@/shared/utils/context/authContextProvider";

import { MoreVertical , X ,Pencil} from "lucide-react"
import useToken from "@/shared/utils/crud/useToken";


import {applyPatch} from "diff"
import { config } from "@/config";

const MergeItem = ({Document,Draft,DocumentName,DraftName,SubmittedDate,MergeMsg}:any) => {
const token = useToken()

const filterDataPayload = (data:any) =>{
        const  {Id,Old_Id,...NewData} = data
        return NewData
    }

const MergeChanges = async(crud:any)=>{
crud["create"].forEach((section:any)=>{
  const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Sections}ListItem`,

    },
      
      ...section
      }
  createQuery(config.ListNames.Sections,payload,token.data.FormDigestValue)
})

crud["update"].forEach((section:any)=>{
  const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Sections}ListItem`,

    },
      
      ...section
      }
  const filteredPayload = filterDataPayload(payload)
  updateQuery(config.ListNames.Sections,section.Id,filteredPayload,token.data.FormDigestValue)
})

crud["delete"].forEach((section:any)=>{
  deleteQuery(config.ListNames.Sections,section.Id,token.data.FormDigestValue)
})
}

const Merge = async (DocId:string,DraftId:string) =>{
      const Draft = await ReadQuery(
  constructUrl(config.ListNames.Commits, undefined, undefined, `Draft eq "${DraftId}"`)
).then((data) => {
  return FormatPatches(groupBy(data, "Section"));
});

// console.log(Draft)

const Doc:any[] = await ReadQuery(
  constructUrl(config.ListNames.Sections, undefined, undefined, `Document eq "${DocId}"`)
).then((data) =>{ return data});
//fill newly created changes into sections 
// console.log(Doc)


const DocKeys = Doc.map((section:any) => {
  return section.Section;
});
for (const Commit in Draft) {
   if (Doc.some((Section:any) => Section.Section == Draft[Commit].Section) == false) {
     Doc.push({
       Section: Draft[Commit].Section,
       Document: Draft[Commit].Document,
       Content: "",
       CreatedAt: Date(),
       EditedAt: "",
     });
   }
}


// apply all patches and merge content 
for (const section in Doc){
  const Commit = Draft.filter((c)=>{
    return  c.Section == Doc[section].Section })[0]
  let new_content = Doc[section].Content
  // console.log(
  //   "old content",
  //   new_content,
  // )
  // console.log("patches",Commit.Patches)
  // JSON.parse(Commit.Patches).forEach((Patch:any)=>{
  //   console.log("patch",Patch)
  //   new_content = applyPatch(new_content,Patch);
  //   console.log("after patch",new_content)
  // })

  for (const patch in JSON.parse(Commit.Patches)){
    // console.log("test for loop",JSON.parse(Commit.Patches)[patch])
    new_content = applyPatch(new_content,JSON.parse(Commit.Patches)[patch])
  }
  Doc[section].Content = new_content;
  Doc[section].EditedAt = Date();

}

//bucket sections into crud type 
const crud:any = {
  create:[],
  update:[],
  delete:[]
}

for (const section in Doc ){
  const commit = Draft.filter(
        (commits) => commits.Section == Doc[section].Section
      )[0]
  if (Doc[section].Id == undefined) {
    // console.log((Doc[section].Id))
  if (commit.LastAction != "delete"){
      crud.create.push(Doc[section]);
    }
  }

  else{
  
   if (commit.LastAction == "delete"){
      crud.delete.push(Doc[section]);

  }
   else if (commit.LastAction =="edit"){
    crud.update.push(Doc[section]);
   }
}

}
// console.log("crud",crud)

MergeChanges(crud)
}

    return ( 
        <div className="flex flex-row justify-between items-center rounded h-[75px] w-auto bg-slate-100 shadow">
            <div className="ml-4">
              {DocumentName}
            </div>
            <div>
                {DraftName}
            </div>
            <div>
                {SubmittedDate}
            </div>
            <div>
                {MergeMsg}
            </div>
            <div className="mr-4">
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={()=>Merge(Document,Draft)}>
                        Review Changes <Pencil className="w-4 h-4 ml-2"></Pencil>

                    </Button>
            </div>
        </div>
     );
}
 
export default MergeItem;