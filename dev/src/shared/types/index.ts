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
  DocumentId:string,
  CatergoryId:string,
  Organisation_Id:string,
  CreatedAt:string,
  EditedAt:string,
  SectionIds:string,
  CurrentCommitId:string,
  CurrentMergeId:string
}


export interface Sections{
  SectionId:string,
  DocumentId:string,
  Content:string,
  CreatedAt:string,
  EditedAt:string,
  SectionIds:string,
  CurrentHash:string,
}

export interface Sections{
  ChangeId:string,
  SectionId:string,
  DocumentId:string,
  Content:string,
  CreatedAt:string,
  Hash:string,
}


export interface Commits{
  CommitId:string,
  DocumentId:string,
  ChangeTree:string,
  CreatedAt:string,
  CommittedAt:string,
  CommitMsg:string,
}



export interface Merges{
  MergeId:string,
  DocumentId:string,
  CommitIds:string,
  CreatedAt:string,
  ApprovedBy:string,
  MergeMsg:string,
}


export interface Users{
  UserId:string,
  email:string
}

export interface Permissions{
  UserId:string,
  document:string
  view:boolean,
  edit:boolean
  merge:boolean,
  isOwner:boolean
}

