import MarkdownRendrer from "../ui/MarkdownRenderer";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Pencil } from "lucide-react";
import { constructReadQueryFn, constructUrl, createQuery ,deleteQuery,updateQuery,ReadQuery} from "@/shared/utils/crud";
import { config } from "@/config";
import { useQuery, useQueryClient } from "react-query";
import { useState ,useContext, useEffect} from "react";
import { AuthContext } from "@/shared/utils/context/authContextProvider";
import { set } from "lodash";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useToast } from "@/components/ui/use-toast"

const DiffViewer = ({Id,token,Document,Draft,Merge}:{Id:number,token:any,Document:string,Draft:any,Merge:any}) => {
const queryClient = useQueryClient()
const [user,setUser] = useContext(AuthContext)
const [newSections, setnewSections] = useState([]);
const [crud, setcrud] = useState();
const { toast } = useToast()


  const filterDataPayload = (data:any) =>{
        const  {Id,Old_Id,...NewData} = data
        return NewData
    }

const MergeChanges = async(crud:any)=>{
try{
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
catch(error){
  console.log(error)
}



}

const updateMetadata = async (DocId:string,DraftId:string,MergeRequestId:number) =>{
  const Document = await ReadQuery(
  constructUrl(config.ListNames.Documents, undefined, undefined, `Document eq '${DocId}'`)
  )
  const Draft = await ReadQuery(
  constructUrl(config.ListNames.Drafts, undefined, undefined, `Draft eq '${DraftId}'`)
  )
  const payload = {
    __metadata:{
      type: `SP.Data.${config.ListNames.Documents}ListItem`,
    },
    SectionOrder:Draft[0].SectionOrder,
    CurrentMerge:MergeRequestId
  }
  updateQuery(config.ListNames.Documents,Document[0].Id,payload,token.data.FormDigestValue)

}

const updateMergeRequest = async (MergeRequestId:number) =>{
     const payload = {
                        __metadata:{
                          type: `SP.Data.${config.ListNames.MergeRequests}ListItem`,
                      },
                        ApporvedBy:user.Id,
                        ApprovalDate:Date()
                      }
                      
                      updateQuery(config.ListNames.MergeRequests,MergeRequestId,payload,token.data.FormDigestValue).then(()=>{
                        queryClient.invalidateQueries("MergeRequests")
                      })



}


    return (

<div>
  <Dialog onOpenChange={(open)=>{
    if (open){
        Merge(Document,Draft).then((data:any)=>{
        setnewSections(data.preview)
        setcrud(data.crud)
  })
      

    }
  }}>
  <DialogTrigger>
    <Button className="bg-blue-500 hover:bg-blue-600">
        Review Changes <Pencil className="w-4 h-4 ml-2"></Pencil>
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-[700px]">
    <DialogHeader>
      <DialogTitle>Reviewing changes for </DialogTitle>
    </DialogHeader>
<Separator></Separator>
    <div className="flex flex-col">
      <ScrollArea className="max-h-[400px]">
        <div className="flex flex-col w-9/12 h-full items-start">
        {newSections.map((section:any)=>{
            return  <MarkdownRendrer key={section.Section} text={section.Content}></MarkdownRendrer>
})}
    </div>

      </ScrollArea>
      <Separator></Separator>

 
    <div className="flex flex-row justify-end mt-4">
      <Button className="bg-blue-500 hover:bg-blue-600"
      onClick={()=>MergeChanges(crud).then(()=>updateMetadata(Document,Draft,Id).then(()=>updateMergeRequest(Id)).then(()=>toast({title:"Merge Approved",description:"the changes have been merged successfully"})))}
      >Approve Merge</Button>
    </div>


    </div>


  </DialogContent>
</Dialog>

</div>

     );
}
 
export default DiffViewer;