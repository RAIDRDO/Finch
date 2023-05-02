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



export interface Documents{
  Document:string,
  Catergory:string,
  Organisation:string,
  CreatedAt:string,
  EditedAt:string,
  Sections:string,
  CurrentCommit:string,
  CurrentMerge:string
}


export interface Sections{
  Section:string,
  Document:string,
  Content:string,
  CreatedAt:string,
  EditedAt:string,
}

export interface CellProps extends Array<Sections> {}

export interface Changes{
  Change:string,
  Section:string,
  Document:string,
  Content:string,
  ChangedAt:string,
  User:string
  Diff:string
}


export interface Commits{
  CommitKey:string,
  Document:string,
  ChangeTree:string,
  CommittedAt:string,
  CommitMsg:string,
  User:string

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
  User:string,
  document:string
  view:boolean,
  edit:boolean
  merge:boolean,
  isOwner:boolean
}


export interface Organisation{
org:string,
owner:string
desc:string
name:string
}

export interface Catergory{
Cat:string,
Org:string,
Owner:string
}