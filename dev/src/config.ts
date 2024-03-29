import dotenv from 'dotenv'
import { env } from 'process'
import { Survey } from './components/survey'
// dotenv.config()

//     console.log(process.env.STAGING)

const dev = {
  
    staging:false,
    DevMode:true,



}

export const config = {
  // apiUrl: 'https://portal.mis.defence.gov.sg/rsaf/RDO/finch/_api/',
  // apiUrl: dev.staging ==false?  'https://5000-poipiii-ravenpoint-ugtpwbjq23e.ws-us102.gitpod.io/ravenpoint/_api/':'https://portal.mis.defence.gov.sg/rsaf/RDO/finch/_api/' ,
  // apiUrl: 'https://5000-poipiii-ravenpoint-cmfgphvl9w6.ws-us101.gitpod.io/ravenpoint/_api/',
    apiUrl: 'http://localhost:5000/ravenpoint/_api/',

  // Insert list IDs, e.g.
  ListNames: {
    Documents:"Documents",

    // Documents:"Docs",
              Drafts:"Drafts",
              Sections:"Sections",
              Changes:"Changes",
            Commits:"Commits",
          Merges:"Merges",
          MergeRequests:"MergeRequests",
        Users:"Users",
      Permissions:"Permissions",
      Organisation:"Organisations",
      Catergory:"Catergories",
    Survey:"Survey",
  BugReport:"BugReport",},
  staleTime: Infinity,
  DevMode:dev.DevMode,
  staging:dev.staging,
  //Any other configs
  tokenRefreshTime: 25 * 60 * 1000
}