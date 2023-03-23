import axios from 'axios';
import { config } from '../../../config';

// Construct a SharePoint REST API endpoint URI
export function constructUrl(
  listTitle: string,
  selectStr: string,
  expandStr?: string,
  filterStr?: string
) {
  return `${config.apiUrl}web/Lists/GetByTitle('${listTitle}')/items?` + 
    `$select=${selectStr}` +
    `${expandStr ? '&$expand=' + expandStr : ''}` +
    `${filterStr ? '&$filter=' + filterStr : ''}` +
    `&$top=5000`;
}

// Construct function for sending a GET query and returning the data
export function constructReadQueryFn(url: string) {
  return async () => {
    const { data } = await axios.get(url, {
      headers: {
        'Accept': 'application/json; odata=nometadata'
      }
    });
    return data.value;
  };
};

// Create query
export async function createQuery(
  listTitle: string,
  data: any,  // Input your data schema interface(s) here
  token: string,
  callback?: Function | null
) {
  const url = `${config.apiUrl}web/Lists/GetByTitle('${listTitle}')/items`
  try {
    await axios.post(url, data, {
      headers: {
        'Accept': 'application/json; odata=verbose',
        'content-type': 'application/json; odata=verbose',
        'X-RequestDigest': token
      }
    });
    callback && callback();
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
  const url = `${config.apiUrl}web/Lists/GetByTitle('${listTitle}')/items(${itemId})`
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
  const url = `${config.apiUrl}web/Lists/GetByTitle('${listTitle}')/items(${itemId})`
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
