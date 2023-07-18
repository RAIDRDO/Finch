// Interfaces for main business entities
export interface IEntity {
  Id: number;
  Title: string;
  // Other columns
}

export interface IPostEntity extends Omit<IEntity, "Id"> {
  '__metadata': {
    type: string;
  };
}


export interface Logs{
    index:string;
    log_type:string;
    log_msg:string;
}


export interface Documents{
  Id?:number
  Document:string,
  Catergory:string,
  Organisation:string,
  CreatedAt:string,
  EditedAt:string,
  SectionOrder:string,
  CurrentCommit:string,
  CurrentMerge:string
  Name:string
}
export interface Drafts extends Documents{
  Draft:string,
  CurrentVersion:number,
  CreatedBy:number
}


export interface Sections{
  Id?:number
  Section:string,
  Document:string,
  Content:string,
  CreatedAt:string,
  EditedAt:string,
}


export interface Changes extends Sections{
  Draft:string,
  Change:string,
  CurrentCommit:string,

}
export interface CellProps extends Array<Sections> {}

export interface  ChangesProps extends Array<Changes> {}



export interface Commits{
  CommitKey:string,
  Document:string,
  ChangeTree:string,
  CommittedAt:string,
  CommitMsg:string,
  User:string

}

export interface Commit {
  Id?:number,
  CommitKey:string,
  Document:string,
  Draft:string,
  Section:string,
  Change:string,
  Patch:any,
  Diff:any,
  CommittedAt:string,
  CommitType:string,
  User:number
}


export interface Merges{
  Merge:string,
  Document:string,
  Commit:string,
  CreatedAt:string,
  ApprovedBy:string,
  MergeMsg:string,
}


export interface Users{
  User:string,
  email:string
}

export interface Permissions{
  Id?:number,
  Permission:string,
  User:string,
  Email:string,
  Resource:string,
  Role:string
 
}


export interface Organisation{
Id?:number
org:string,
owner:string
desc:string
name:string
}

export interface Catergory{
Id?:number
Cat:string,
Org:string,
Owner:string
Name:string
}


export interface SPUser{
Id:number,
Title:string,
Email:string
}



export interface ResourcePermissions {
    OrgViewer:boolean,
    OrgEditor:boolean,
    OrgContributor :boolean,
    CatViewer:boolean,
    CatEditor:boolean,
    CatContributor:boolean,
    DocViewer:boolean,
    DocEditor:boolean,
    DocContributor:boolean,
    OrgOwner:boolean,
    CatOwner:boolean,
    DocOwner:boolean
}