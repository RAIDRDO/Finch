import { ResourcePermissions } from "@/shared/types";

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




export const ResolveRole = (role:string,action:string):string => {
    const actions= ['create','view','edit'];
    if (role === 'Org-Owner' && action === 'create') {
        return 'Org-Owner';
    }

    else if (role === 'Org-Owner' && action === 'update') {
        return 'Org-Editor';
    }
    else{
        return role;
    }


}