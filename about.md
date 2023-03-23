# About
*Stack 2.0* is an initiative by RDO to make full use of the limited IT infrastructure. It's a half-step toward a more modern stack for software. 

Some examples of apps built on Stack 2.0:

| App | Purpose |
| :-- | :------ |
| [ROKR](https://github.com/chrischow/rokr) | For managing RAiD's Objectives & Key Results. |
| [RDO Data Catalogue](https://github.com/chrischow/rdo-data-catalogue) | Data catalogue to make data discoverable. |
| [GNO](https://github.com/chrischow/rdo-gno) | Information portal for military platforms and weapons. |
| [RDO Markdown Editor](https://github.com/chrischow/rdo-md-editor) | For notetaking in markdown with a preview. |

## The Stack

Frontend tools:

| Library | Purpose |
| :------ | :------ |
| react | Frontend library |
| react-router-dom | For routing as an SPA |
| react-query | State management and querying |
| axios | HTTP requests |
| jquery | DOM manipulation |
| validator | Form validation |
| slugify | Shortening text to safe form |
| react-icons | Icons |
| craco | Custom build to single bundle |

Backend tools:

| Library | Purpose |
| :------ | :------ |
| SharePoint Lists | Database |
| SharePoint Document Libraries | For serving pages and hosting assets |
| SharePoint REST API | For programmatic access to data |
| SharePoint Permissions | For access control |
| RavenPoint (external) | SharePoint REST API emulator (For development only) |

## Project Structure
See the diagram below for the project structure for a standard Stack 2.0 project. The `prod-build` folder is for housing the packaged app, while the `dev` folder contains the source files. The files listed below are *in addition / changes* to the default Create-React-App TypeScript template.

```
.
├── prod-build                       # Compiled files - similar structure to dev/build
│   ├── static
│   │   ├── css
│   │   ├── js
│   └── index.html
├── dev
│   ├── src
│   │   ├── <top-level component>    # Top-level React components, imported in App.js
│   │   ├── shared                   # Any code used by multiple components  
│   │   │   ├── utils                # - Custom functions
│   │   │   ├── hooks                # - React Query hooks
│   │   │   ├── types                # - Common interfaces
│   │   │   └── <custom components>  # - Custom components
│   │   └── config.tsx               # Custom configs: API base URL, List IDs, React Query settings
│   ├── cra-instructions.md          # Create-React-App instructions, just in case
│   └── README.md                    # Developer guide
└── README.md                        # Project README
```

## Security
Stack 2.0 takes reference from the following:

1. Open Web Application Security Project (OWASP) [Secure Coding Practices Checklist](https://owasp.org/www-pdf-archive/OWASP_SCP_Quick_Reference_Guide_v2.pdf)
2. Rules for finding [JavaScript](https://rules.sonarsource.com/javascript) / [TypeScript](https://rules.sonarsource.com/typescript) vulnerabilities, bugs, security hotspots, or code smells
3. Testing: [Web Security Testing Guide](https://github.com/OWASP/wstg/)
4. Snyk.io scanning

## Notes
#### Why TypeScript Over JavaScript?
We prefer TypeScript because of the following benefits:

- Facilitates detection of errors during development
- Enforces standards by having developers write readable, self-explanatory code without additional commentary
- Exploits IDEs' in-built functionality (e.g. VSCode Intellisense) for automatic documentation and autocompletion

**CAUTION:** Although TypeScript is strongly-typed, it does not mean that the code you write is more secure than JavaScript. Type checking happens during *compile time*, as opposed to *runtime*. After transpilation, all type information is removed, since vanilla JavaScript does not use type checking. Therefore, **insecure code (e.g. unsanitised inputs) written in TypeScript will still be insecure after transpilation to JavaScript**.

> Note: This decision was taken recently. Migration of solutions to TypeScript is underway.

#### Why Bootstrap?
First, Bootstrap is simple and somewhat opinionated, which takes some cognitive load off developers to decide what styles to implement. Second, Bootstrap is consistent. You won't get the beautiful UIs that can be achieved with Material, but you will achieve a familiar *Bootstrap* feel across all web apps. Third, Bootstrap has incredible community support. If you don't know how to implement something, chances are that someone on StackOverflow already has.

#### Why React-Query?
React-Query allows you to write queries to fetch data, and it handles the caching and subsequent updates to that data, subject to your specified update frequency or conditions.

##### Custom Hooks
We define custom hooks for each entity separately e.g. `useTransactions`, `useCustomers`. These are separated into the respective scripts in the `hook` folder.

In general, for *small apps*, we query all data at the start and re-use that query or its cache for displaying subsets of the data. This is likely to be the case for the kind of use cases we build apps for - we don't have a massive user base or a huge amount of data. If there are *big apps* (no exposure yet), we will only query the data we need, and cache it as it arrives.

| App / Database Size | Query A Large Number of Entries | Query One Entry | Query Entries Based on Criteria |
| :------------------ | :----------- | :-------------- | :------------------------------ |
| Small | Query all data ("select-all" query). Use the entity name e.g. "transactions" as the query key. | Use the "select-all" query. Then, filter the resulting data by a given ID. | Use the "select-all" query. Then, filter the resulting data by the required criteria. |
| Large | Query data by pages. Use the entity name and page number in the query key e.g. `['transactions', 1]`. Consider [adding each queried entry to the cache](https://stackoverflow.com/questions/69094789/how-to-best-get-data-from-react-query-cache) with the entity and ID as keys e.g. `['transactions', 'vu905y3ngf']` for faster retrieval later on. | Query data by entity and ID. The query key would contain both these pieces of info e.g. `['transactions', 'y01oug84t80g4']`. | Query data by entity and other key info about the criteria. For example, if the criteria is `country = 'SG'`, then a query key could be `['transactions', 'country', 'SG']`.

For medium-sized apps/databases, the approach would be somewhere in between the extremes.

##### Stale Time
To alleviate load on the backend, we set a minimum stale time of **2 minutes**. Most apps don't require real-time data - hence, we don't aim to provide it. Instead, provide a way for users to refresh the data if they really want to. Of course, if real-time data is actually required - and you should do your due diligence to check if end users **REALLY** need it - the stale time setting can be lowered.