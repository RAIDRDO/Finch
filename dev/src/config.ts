export const config = {
  apiUrl: 'https://5000-poipiii-finch-3c4uzaiy27c.ws-us96b.gitpod.io/ravenpoint/_api/',
  // Insert list IDs, e.g.
  ListNames: {Documents:"Documents",
              Sections:"Sections",
              Changes:"Changes",
            Commits:"Commits",
          Merges:"Merges",
        Users:"Users",
      Permissions:"Permissions",
      Organisation:"Organisations",
      Catergory:"Catergories"},
  staleTime: Infinity,
  DevMode:true,
  //Any other configs
  tokenRefreshTime: 25 * 60 * 1000
}