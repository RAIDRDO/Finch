
import { Button } from "@/components/ui/button"
import { constructReadQueryFn, constructUrl, createQuery ,deleteQuery,updateQuery,ReadQuery} from "@/shared/utils/crud";

import { groupBy,FormatPatches } from '@/shared/utils/crud/helper';
import { AuthContext } from "@/shared/utils/context/authContextProvider";

import { MoreVertical , X ,Pencil} from "lucide-react"
import useToken from "@/shared/utils/crud/useToken";


import {applyPatch} from "diff"
import { config } from "@/config";
import { useState ,useContext} from "react";
import App from "@/App";
import { useQuery, useQueryClient } from "react-query";
import {DateTime} from "luxon"  
import DiffViewer from "../diff/diffViewer";


const MergeItem = ({Id,MergeRequest,Document,Draft,DocumentName,DraftName,SubmittedDate,MergeMsg,ApporvedBy,ApprovalDate}:any) => {
const token = useToken()
const [user,setUser] = useContext(AuthContext)
const queryClient = useQueryClient()

// const filterDataPayload = (data:any) =>{
//         const  {Id,Old_Id,...NewData} = data
//         return NewData
//     }

// const MergeChanges = async(crud:any)=>{
// try{
//   crud["create"].forEach((section:any)=>{
//     const payload = {
//              __metadata:{
//           type: `SP.Data.${config.ListNames.Sections}ListItem`,
  
//       },
        
//         ...section
//         }
//     createQuery(config.ListNames.Sections,payload,token.data.FormDigestValue)
//   })
  
//   crud["update"].forEach((section:any)=>{
//     const payload = {
//              __metadata:{
//           type: `SP.Data.${config.ListNames.Sections}ListItem`,
  
//       },
        
//         ...section
//         }
//     const filteredPayload = filterDataPayload(payload)
//     updateQuery(config.ListNames.Sections,section.Id,filteredPayload,token.data.FormDigestValue)
//   })
  
//   crud["delete"].forEach((section:any)=>{
//     deleteQuery(config.ListNames.Sections,section.Id,token.data.FormDigestValue)
//   })
// }
// catch(error){
//   console.log(error)
// }

// }


// const updateMetadata = async (DocId:string,DraftId:string,MergeRequestId:string) =>{
//   const Document = await ReadQuery(
//   constructUrl(config.ListNames.Documents, undefined, undefined, `Document eq '${DocId}'`)
//   )
//   const Draft = await ReadQuery(
//   constructUrl(config.ListNames.Drafts, undefined, undefined, `Draft eq '${DraftId}'`)
//   )
//   const payload = {
//     __metadata:{
//       type: `SP.Data.${config.ListNames.Documents}ListItem`,
//     },
//     SectionOrder:Draft[0].SectionOrder,
//     CurrentMerge:MergeRequestId
//   }
//   updateQuery(config.ListNames.Documents,Document[0].Id,payload,token.data.FormDigestValue)

// }

const Merge = async (DocId:string,DraftId:string) =>{
try{
      const Commits = await ReadQuery(
  constructUrl(config.ListNames.Commits, undefined, undefined, `Draft eq '${DraftId}'`)
).then((data) => {
  // console.log(data)
  return FormatPatches(groupBy(data, "Section"));
});

// console.log("draft",Draft)

const Sections:any[] = await ReadQuery(
  constructUrl(config.ListNames.Sections, undefined, undefined, `Document eq '${DocId}'`)
).then((data) =>{ return data});

const Merges:any[] = await ReadQuery(
  constructUrl(config.ListNames.Merges, undefined, undefined, `Draft eq '${DraftId}'`)
).then((data) =>{ return data});

const prevMerge = Merges[Merges.length-1]

console.log("merges",JSON.parse(prevMerge.Commits))

//fill newly created changes into sections 
// console.log(Doc)


const DocKeys = Sections.map((section:any) => {
  return section.Section;
});
for (const Commit in Commits) {
   if (Sections.some((Section:any) => Section.Section == Commits[Commit].Section) == false) {
     Sections.push({
       Section: Commits[Commit].Section,
       Document: Commits[Commit].Document,
       Content: "",
       CreatedAt: Date(),
       EditedAt: "",
       Classification:""
     });
   }
}


// apply all patches and merge content 
for (const section in Sections){
  const Commit = Commits.filter((c)=>{
    return  c.Section == Sections[section].Section })[0]
  let new_content = ""
  let classification = ""
  // console.log(
  //   "old content",
  //   new_content,
  // )
  // console.log("patches",Commit.Patches)
  JSON.parse(Commit?.Patches)?.forEach((Patch:any)=>{
    console.log("patch",Patch)
    new_content = applyPatch(new_content,Patch);
    // console.log("after patch",new_content)
  })

  // for (const patch in JSON.parse(Commit.Patches)){
  //   // console.log("test for loop",JSON.parse(Commit.Patches)[patch])
  //   new_content = applyPatch(new_content,JSON.parse(Commit.Patches)[patch])
  // }
  Sections[section].Content = new_content;
  Sections[section].EditedAt = Date();
  Sections[section].Classification = Commit.Classification
}

//bucket sections into crud type 
const crud:any = {
  create:[],
  update:[],
  delete:[]
}

for (const section in Sections ){
  const commit = Commits.filter(
        (commits) => commits.Section == Sections[section].Section
      )[0]
  if (Sections[section].Id == undefined) {
    // console.log((Doc[section].Id))
  if (commit.LastAction != "delete"){
      crud.create.push(Sections[section]);
    }
  }

  else{
  
   if (commit.LastAction == "delete"){
      crud.delete.push(Sections[section]);

  }
   else if (commit.LastAction =="edit"){
    crud.update.push(Sections[section]);
   }
}

}
// console.log("crud",crud)
console.log("sections",Sections)


return {
  preview:Sections,
  crud:crud
}
}
catch(error){
  console.log(error)
}
}


return ( 
        <div className="flex flex-row justify-between items-center rounded h-[75px] w-auto bg-slate-100 shadow">
            <div className="ml-4">
              {DocumentName}
            </div>
            <div>
                {DraftName}
            </div>
            {ApprovalDate != "" || ApporvedBy == null ? <div>
              {DateTime.fromMillis(Date.parse(ApprovalDate)).toFormat("FF")}
            </div> :
            <div>
                {DateTime.fromMillis(Date.parse(SubmittedDate)).toFormat("FF")}
            </div>
}
            <div>
                {MergeMsg}
            </div>
            <div className="mr-4">
              

            </div>
            {ApporvedBy == "" || ApporvedBy == null? 

            <div className="mr-4">
                    {/* <Button className="bg-blue-500 hover:bg-blue-600" onClick={()=>Merge(Document,Draft).then((data)=>{
                        MergeChanges(data?.crud).then(()=>{
                          updateMetadata(Document,Draft,Id).then(()=>{
                      const payload = {
                        __metadata:{
                          type: `SP.Data.${config.ListNames.MergeRequests}ListItem`,
                      },
                        ApporvedBy:user.Id,
                        ApprovalDate:Date()
                      }
                      
                      updateQuery(config.ListNames.MergeRequests,Id,payload,token.data.FormDigestValue).then(()=>{
                        queryClient.invalidateQueries("MergeRequests")
                      })
})

                        })
                    })
                   }>
                        Review Changes <Pencil className="w-4 h-4 ml-2"></Pencil>

                    </Button> */}
                    <DiffViewer Id={Id} token={token} Document={Document} Draft={Draft} Merge={Merge} ></DiffViewer>
            </div>
: <div></div>}
        </div>
     );
}
 
export default MergeItem;