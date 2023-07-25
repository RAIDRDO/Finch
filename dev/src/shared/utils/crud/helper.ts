import { ResourcePermissions } from "@/shared/types";
import {createPatch,parsePatch} from "diff"
export const ResolvePermissions = (role: string):ResourcePermissions => {
    const permissions:ResourcePermissions = {
        OrgViewer:false,
        OrgEditor:false,
        OrgContributor :false,
        CatViewer:false,
        CatEditor:false,
        CatContributor:false,
        DocViewer:false,
        DocEditor:false,
        DocContributor:false,
        OrgOwner:false,
        CatOwner:false,
        DocOwner:false

    }
    switch (role) {
        case 'Org-Viewer':
            permissions.OrgViewer = true;
            permissions.CatViewer = true;
            permissions.DocViewer = true;
            return permissions;
        case 'Org-Editor':
            permissions.OrgViewer = true;
            permissions.OrgEditor = true;
            permissions.CatViewer = true;
            permissions.CatEditor = true;
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            return permissions;
        case 'Org-Contributor':
            permissions.OrgViewer = true;
            permissions.OrgEditor = true;
            permissions.OrgContributor = true;
            permissions.CatViewer = true;
            permissions.CatEditor = true;
            permissions.CatContributor = true;
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            permissions.DocContributor = true;
            return permissions;
        case 'Org-Owner':
            permissions.OrgViewer = true;
            permissions.OrgEditor = true;
            permissions.OrgContributor = true;
            permissions.OrgOwner = true;
            permissions.CatViewer = true;
            permissions.CatEditor = true;
            permissions.CatContributor = true;
            permissions.CatOwner = true;
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            permissions.DocContributor = true;
            permissions.DocOwner = true;
            return permissions;
        case 'Cat-Viewer':
            permissions.CatViewer = true;
            permissions.DocViewer = true;
            return permissions;
        case 'Cat-Editor':
            permissions.CatViewer = true;
            permissions.CatEditor = true;
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            return permissions;
        case 'Cat-Contributor':
            permissions.CatViewer = true;
            permissions.CatEditor = true;
            permissions.CatContributor = true;
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            permissions.DocContributor = true;
            return permissions;
        case 'Cat-Owner':
            permissions.CatViewer = true;
            permissions.CatEditor = true;
            permissions.CatContributor = true;
            permissions.CatOwner = true;
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            permissions.DocContributor = true;
            permissions.DocOwner = true;
            return permissions;
        case 'Doc-Viewer':
            permissions.DocViewer = true;
            return permissions;
        case 'Doc-Editor':
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            return permissions;
        case 'Doc-Contributor':
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            permissions.DocContributor = true;
            return permissions;
        case 'Doc-Owner':
            permissions.DocViewer = true;
            permissions.DocEditor = true;
            permissions.DocContributor = true;
            permissions.DocOwner = true;
            return permissions;    
        default:
            return permissions;
    }
}




export const ResolveRole = (role:string,action:string):any => {
    const actions= ['create','view','edit'];
    if (role === 'Org-Owner' && actions.includes(action)) {
        return 'Org-Owner';
    }

    else if (role === 'Cat-Owner' && actions.includes(action)) {
        return 'Cat-Owner';
    }

    else if (role === 'Doc-Owner' && actions.includes(action)) {
        return 'Doc-Owner';
    }

    else if (role === 'Org-Contributor' && actions.includes(action)) {
        return 'Org-Contributor';
    }

    else if (role === 'Cat-Contributor' && actions.includes(action)) {
        return 'Cat-Contributor';
    }

    else if (role === 'Doc-Contributor' && actions.includes(action)) {
        return 'Doc-Contributor';
    }
    
    
    else{
        return false
    }


}



export const CreateCommit = (name:string,original:string,changes:string)=>{
try{
    console.log(changes)
    const DiffStr = createPatch(name, original, changes);
    // console.log("DiffStr",DiffStr)
    const Patch = parsePatch(DiffStr);
    // console.log("Patch",Patch)
    return { DiffStr: DiffStr ,Patch:Patch};
}
catch(error){
console.log("CreateCommit",error)
}

} 


export const groupBy = (items:any, key:any) =>
  items.reduce(
    (result:any, item:any) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

export const FormatPatches = (groupedBy:any)=>{
    return Object.keys(groupedBy).map((key)=>{
        const patches:any = []
        const diffs:any = []
        const Commits:any = []
        let  Document = ""
        let Draft =""
        let Change = ""
        let Action =""
        let Classification = ""
        groupedBy[key].map((patch:any)=>{
            patches.push(JSON.parse(patch.Patch))
            diffs.push(patch.Diff);
            Commits.push(patch.CommitKey)
            Document = patch.Document;
            Draft = patch.Draft;
            Change = patch.Change;
            Action = patch.CommitType
            Classification = patch.Classification


        })
        const Merge = {
          Document : Document,
          Draft:Draft,
          Change:Change,
          Section: key,
          Commits:JSON.stringify(Commits),
          Patches : JSON.stringify(patches),
          Diffs : JSON.stringify(diffs),
          LastAction:Action,
          Classification:Classification

        };

        return Merge;



})
} 