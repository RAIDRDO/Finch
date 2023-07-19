export const config = {
  // apiUrl: 'https://portal.mis.defence.gov.sg/rsaf/RDO/finch/_api/',
  //apiUrl: 'http://localhost:5000/ravenpoint/_api/',
  apiUrl: 'https://5000-poipiii-ravenpoint-cmfgphvl9w6.ws-us101.gitpod.io/ravenpoint/_api/',

  // Insert list IDs, e.g.
  ListNames: {
    // Documents:"Documents",

    Documents:"Docs",
              Drafts:"Drafts",
              Sections:"Sections",
              Changes:"Changes",
            Commits:"Commits",
          Merges:"Merges",
          MergeRequests:"MergeRequests",
        Users:"Users",
      Permissions:"Permissions",
      Organisation:"Organisations",
      Catergory:"Catergories"},
  staleTime: Infinity,
  DevMode:true,
  staging:false,
  //Any other configs
  tokenRefreshTime: 25 * 60 * 1000
}