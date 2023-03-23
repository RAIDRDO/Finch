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