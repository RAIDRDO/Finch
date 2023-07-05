import axios from 'axios';
import { config } from '../../../config';
import { v4 as uuidv4 } from 'uuid';
// Construct a SharePoint REST API endpoint URI
export function constructUrl(
  listTitle: string,
  selectStr?: string,
  expandStr?: string,
  filterStr?: string
) {
  return `${config.apiUrl}web/lists/GetByTitle('${listTitle}')/items?` + 
    `${selectStr ? '&$select=' + selectStr:''}` +
    `${expandStr ? '&$expand=' + expandStr : ''}` +
    `${filterStr ? '&$filter=' + filterStr : ''}` +
    `&$top=5000`;
}

// Construct function for sending a GET query and returning the data
export function constructReadQueryFn(url: string) {
  return async () => {
    const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return data;
  };
};

export function constructCreateQueryFn(url: string) {
  return async () => {
    const { data } = await axios.post(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return data;
  }
};

export async function ReadQuery(url: string) {
const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return data.value;
}



// Create query
export async function createQuery(
  listTitle: string,
  data: any,  // Input your data schema interface(s) here
  token: string,
  callback?: Function | null
) {
  const url = `${config.apiUrl}web/lists/GetByTitle('${listTitle}')/items`
  try {
    const res = await axios.post(url, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',

        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token
      }
    });
    callback && callback();
    return res.data
  } catch (error) {
    console.log('Error:', error);
  }
};

// Update query - must refer to List item URL and include object containing item + metadata
export async function updateQuery(
  listTitle: string,
  itemId: number | undefined,
  data: any,  // Input your data schema interface(s) here
  token: string,
  callback?: Function | null
) {
  const url = `${config.apiUrl}web/lists/GetByTitle('${listTitle}')/items(${itemId})`
  try {
    await axios.post(url, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token,
        'IF-MATCH': '*',
        'X-HTTP-METHOD': 'MERGE'
      }
    });
    // console.log(response);
    callback && callback();
  } catch (error) {
    console.log('Error:', error);
  }
};

// Delete query - must refer to List item URL
export async function deleteQuery(
  listTitle: string,
  itemId: number,
  token: string,
  callback?: Function | null
) {
  const url = `${config.apiUrl}web/lists/GetByTitle('${listTitle}')/items(${itemId})`
  try {
    await axios.post(url, undefined, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token,
        'IF-MATCH': '*',
        'X-HTTP-METHOD': 'DELETE'
      }
    });
    // console.log(response);
    callback && callback();
  } catch (error) {
    console.log('Error:', error);
  }
};


export async function CascadeDelete(token:string,UUID:string,level:string,) {
  if (level =="ORG"){
    const cats = await ReadQuery(constructUrl(config.ListNames.Catergory,undefined,undefined,`Org eq '${UUID}'`))
    const docs = await ReadQuery(constructUrl(config.ListNames.Documents,undefined,undefined,`Organisation eq '${UUID}'`))
    const orgperm = await ReadQuery(constructUrl(config.ListNames.Permissions,undefined,undefined,`Resource eq '${UUID}'`))

    orgperm.forEach(async (perm:any) => {
      await deleteQuery(config.ListNames.Permissions,perm.Id,token)
    })

    cats.forEach(async (cat:any) => {
      await deleteQuery(config.ListNames.Catergory,cat.Id,token)
      const catperm = await ReadQuery(constructUrl(config.ListNames.Permissions,undefined,undefined,`Resource eq '${cat.Cat}'`))
      catperm.forEach(async (perm:any) => {
        await deleteQuery(config.ListNames.Permissions,perm.Id,token)
      })

    })
    docs.forEach(async (doc:any) => {
      const docperm = await ReadQuery(constructUrl(config.ListNames.Permissions,undefined,undefined,`Resource eq '${doc.Document}'`))
      docperm.forEach(async (perm:any) => {
        await deleteQuery(config.ListNames.Permissions,perm.Id,token)
      })
      const sections = await ReadQuery(constructUrl(config.ListNames.Sections,undefined,undefined,`Document eq '${doc.Document}'`))
      sections.forEach(async (section:any) => {
        await deleteQuery(config.ListNames.Sections,section.Id,token)
      })
      await deleteQuery(config.ListNames.Documents,doc.Id,token)
    }
    )
  }

  else if (level =="CAT"){
    const catperm = await ReadQuery(constructUrl(config.ListNames.Permissions,undefined,undefined,`Resource eq '${UUID}'`))
    catperm.forEach(async (perm:any) => {
        await deleteQuery(config.ListNames.Permissions,perm.Id,token)
      })
    const docs = await ReadQuery(constructUrl(config.ListNames.Documents,undefined,undefined,`Catergory eq '${UUID}'`))
    docs.forEach(async (doc:any) => {
      const docperm = await ReadQuery(constructUrl(config.ListNames.Permissions,undefined,undefined,`Resource eq '${doc.Document}'`))
      docperm.forEach(async (perm:any) => {
        await deleteQuery(config.ListNames.Permissions,perm.Id,token)
      })
      const sections = await ReadQuery(constructUrl(config.ListNames.Sections,undefined,undefined,`Document eq '${doc.Document}'`))
      sections.forEach(async (section:any) => {
        await deleteQuery(config.ListNames.Sections,section.Id,token)
      })
      await deleteQuery(config.ListNames.Documents,doc.Id,token)
    }
    )
    
  }
  else if (level =="DOC"){
    const docperm = await ReadQuery(constructUrl(config.ListNames.Permissions,undefined,undefined,`Resource eq '${UUID}'`))
      docperm.forEach(async (perm:any) => {
        await deleteQuery(config.ListNames.Permissions,perm.Id,token)
      })
    const sections = await ReadQuery(constructUrl(config.ListNames.Sections,undefined,undefined,`Document eq '${UUID}'`))
    sections.forEach(async (section:any) => {
      await deleteQuery(config.ListNames.Sections,section.Id,token)
    })}

   else{
    console.log("Error: CascadeDelete invalid level")
  }
}




 export const addPermission = (token:string,Id:string,IdSP:any,UserId:string,Email:string,type:string,Role:string) => {
  const data =  {
        Permission:uuidv4(),
        User:UserId,
        Email:Email,
        Resource:Id,
        OrgLookUpId:null,
        CatLookUpId:null,
        DocLookUpId:null,
        ResourceType:type,
        Role:Role
      
      }
  switch (type) {
    case "organization":
      data.OrgLookUpId = IdSP
      break;
    case "category":
      data.CatLookUpId = IdSP
      break;
    case "document":
      data.DocLookUpId = IdSP
      break;

  }
  
  const payload = {
           __metadata:{
        type: `SP.Data.${config.ListNames.Permissions}ListItem`,

    },
      
      ...data
      }
      const res = createQuery(config.ListNames.Permissions,payload,token)
      try {
        return res
      } catch (error) {
        console.log(error)
      }
  }
