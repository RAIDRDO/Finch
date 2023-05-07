// const useToken  = require('./shared/utils/crud/useToken.ts')
const {constructUrl,constructReadQueryFn,createQuery,deleteQuery,updateQuery}  = require('./shared/utils/crud')
const  {config}  = require('./config')

const axios = require('axios')
import { Documents,Sections,Commits,Merges,Permissions,Users, Changes } from './shared/types' 
import { v4 as uuidv4 } from 'uuid';



import { faker } from '@faker-js/faker';
import _, { merge, random } from 'lodash';
const Diff = require("diff");




// const one = "beep boop doo doo";
// const other = "beep boob blah doo";
// const future_other = "beep boob boob doo da"
// const diff = Diff.diffChars(one, future_other);
// console.log(diff);
// const patch = Diff.createPatch("test", one, future_other);
// const spatch = Diff.parsePatch(patch)
// console.log(JSON.stringify(diff));
// console.log(JSON.stringify(spatch));
// // console.log(Diff.applyPatch(one, diff));
// const test = Diff.applyPatch(one,spatch);
// console.log(test);

// const markdown = ```
// wqweqw
// ```


// const document:Documents = {
// DocumentId:uuidv4(),
// SectionIds:JSON.stringify([uuidv4(),uuidv4()]),
// CatergoryId:uuidv4(),
// Organisation_Id:uuidv4(),
// CreatedAt:Date(),
// EditedAt:Date(),
// CurrentCommitId:"123456",
// CurrentMergeId:"123"
// }


// const section:Sections = {
// DocumentId:uuidv4(),
// SectionId:uuidv4(),
// Content:"",
// CreatedAt:Date(),
// EditedAt:Date(),
// CurrentHash:"test"
// }


// const changes:Changes = {
// ChangeId:uuidv4(),
// DocumentId:uuidv4(),
// SectionId:uuidv4(),
// Content:"",
// CreatedAt:Date(),
// Hash:"test"
// }


// const commits:Commits = {
// CommitId:uuidv4(),
// DocumentId:uuidv4(),
// ChangeTree:"",
// CreatedAt:Date(),
// CommittedAt:Date(),
// CommitMsg:""

// }


// const merges:Merges = {
// MergeId:uuidv4(),
// DocumentId:uuidv4(),
// CommitIds:[uuidv4()],
// CreatedAt:Date(),
// ApprovedBy:"",
// MergeMsg:""

// }
// const user:Users = {
// UserId:uuidv4(),
// email:"test"

// }


// const permissions:Permissions = {
//   UserId:uuidv4(),
//   document:uuidv4(),
//   view:true,
//   edit:true,
//   merge:true,
//   isOwner:true
// }



function seedOwner(token:string,ownerId:string):any{
const user:Users = {
User:ownerId,
email:faker.internet.email()
}

const payload = {
   __metadata:{
        type: `SP.Data.${config.ListNames.Users}ListItem`,

    },
    ...user
}

try {
  createQuery(config.ListNames.Users,payload,token)
} catch (error) {
  console.error(error)
}
}


function seedUsers(token:string,users:string[]):any{
users.map((userid)=>{
const user:Users = {
User:userid,
email:faker.internet.email()
}
const payload = {
   __metadata:{
        type: `SP.Data.${config.ListNames.Users}ListItem`,

    },
    ...user
}

try {
  createQuery(config.ListNames.Users,payload,token)
} catch (error) {
  console.error(error)
}
})
}

function seedPermissions(token:string,DocumentId:string,users:string[],isOwner:boolean):any{
users.map((userid)=>{
if (isOwner){
const permissions:Permissions = {
  User:userid,
  document:DocumentId,
  view:true,
  edit:true,
  merge:true,
  isOwner:true
}
const payload = {
   __metadata:{
        type: `SP.Data.${config.ListNames.Permissions}ListItem`,

    },
    ...permissions
}

try {
  createQuery(config.ListNames.Permissions,payload,token)
} catch (error) {
  console.error(error)
}
}
else{
const permissions:Permissions = {
  User:userid,
  document:DocumentId,
  view:true,
  edit:true,
  merge:true,
  isOwner:false
}
const payload = {
   __metadata:{
        type: `SP.Data.${config.ListNames.Permissions}ListItem`,

    },
    ...permissions
}

try {
  createQuery(config.ListNames.Permissions,payload,token)
} catch (error) {
  console.error(error)
}
}


})
}





function seedDocuments(token:string,DocumentId:string,SectionIds:string[],CatergoryId:string,Organisation_Id:string): any{
const document:Documents = {
Document:DocumentId,
Catergory:CatergoryId,
Organisation:Organisation_Id,
Sections:JSON.stringify(SectionIds),
CreatedAt:Date(),
EditedAt:Date(),
CurrentCommit:"",
CurrentMerge:"",
Name:""
}


const payload = {
   __metadata:{
        type: `SP.Data.DocumentsListItem`,

    },
    ...document
}
try {
  createQuery(config.ListNames.Documents,payload,token)
} catch (error) {
  console.error(error)
}

}

function seedSections(token:string,DocumentId:string,contents:any): any{
Object.keys(contents).map((key)=>{
const section:Sections = {
Document:DocumentId,
Section:key,
Content:contents[key],
CreatedAt:Date(),
EditedAt:Date(),
}
const payload = {
   __metadata:{
        type: `SP.Data.${config.ListNames.Sections}ListItem`,

    },
    ...section
}

try {
  createQuery(config.ListNames.Sections,payload,token)
} catch (error) {
  console.error(error)
}
})
}


function seedChanges(token:string,DocumentId:string,UserIds:string[],Changes:any): any{


Changes.map((items:any)=>{
const changes:Changes = {
Change:uuidv4(),
Document:DocumentId,
Section:items[0].SectionId,
Content:items[0].changedContent,
ChangedAt:Date(),
User:UserIds[Math.floor(Math.random()*UserIds.length)],
Diff:items[1].diff
}


const payload = {
   __metadata:{
        type: `SP.Data.${config.ListNames.Changes}ListItem`,

    },
    ...changes
} 

try {
  createQuery(config.ListNames.Changes,payload,token)
} catch (error) {
  console.error(error)
}

})


}


function seedCommits(token:string,DocumentId:string,UserIds:string[],Changes:any): any{
const commits:Commits = {
CommitKey:uuidv4(),
Document:DocumentId,
ChangeTree:JSON.stringify(Changes),
CommittedAt:Date(),
CommitMsg:faker.git.commitMessage(),
User:UserIds[Math.floor(Math.random()*UserIds.length)]
}

const payload = {
    __metadata:{
        type: `SP.Data.${config.ListNames.Commits}ListItem`,
}
,
...commits
}
try {
  createQuery(config.ListNames.Commits,payload,token)
  return commits.CommitKey
} catch (error) {
  console.error(error)
}
}

function seedMerges(token:string,DocumentId:string,CommitId:any,OwnerId:string): any{
const merges:Merges ={
Merge:uuidv4(),
Document:DocumentId,
CreatedAt:Date(),
Commit:CommitId,
ApprovedBy:OwnerId,
MergeMsg:faker.git.commitMessage()
}

const payload = {
    __metadata:{
        type: `SP.Data.${config.ListNames.Merges}ListItem`,
}
,
...merges

}

try {
  createQuery(config.ListNames.Merges,payload,token)
}
catch (error) {
  console.error(error)
}

}



function generateDiff(SectionIds:string[],Lorem:string[],EditedLorem:string[]){
const diffs = _.zip(Lorem,EditedLorem,SectionIds).map((items)=>{
const orignal = items[0]
const edited = items[1]
const sectionId = items[2]
const diffstr = Diff.createPatch("test", orignal, edited)
const diff = Diff.parsePatch(diffstr)
const json_diff = JSON.stringify(diff)
const diffobj = {SectionId:sectionId,diff:json_diff}
return diffobj
})

return diffs
}



function generateUUids(range:number): string[]{
const  uuids = []
for(let i=0  ; i<range ;i++){
  uuids.push(uuidv4())
}
return uuids
}

function generateRandomLorem(range:number){
const  lorem = []
for(let i=0  ; i<range ;i++){
  lorem.push(faker.lorem.paragraphs(1,'\n'))
}
return lorem
}


function generateRandomlyEditedLorem(lorem:string[]){
const  editedLorem = []
for(let i=0  ; i<lorem.length ;i++){
  let edited = lorem[i].split(' ')
  const randomRange = [...Array(Math.floor(Math.random()*10))].map(n=>Math.floor(Math.random()*edited.length))
  for (let j=0 ; j<randomRange.length ; j++){
      edited.splice(randomRange[j],1)

  }
    

  editedLorem.push(edited.join(' '))
}
return editedLorem
}



async function seeddb(){
const token =  await axios.post(config.apiUrl + 'contextinfo', {
   headers: {
        'Accept': 'application/json; odata=nometadata'
      }
}).then((res:any)=>{return res.data.FormDigestValue})

  const DocumentId = uuidv4()
  const main_user  = uuidv4()
  const users = generateUUids(10)
  const CatergoryId = uuidv4()
  const Organisation_Id  = uuidv4()
  const randomRange = Math.floor(Math.random()*11)
  const SectionIds = generateUUids(randomRange)
  const lorem = generateRandomLorem(randomRange)
  const editedLorem = generateRandomlyEditedLorem(lorem)
  const content = _.zipObject(SectionIds,lorem)
  const changedContent = _.zip(SectionIds,editedLorem).map((items)=> {
  return  {SectionId:items[0],changedContent:items[1]}})
  const diffs = generateDiff(SectionIds,lorem,editedLorem)
  const changes = _.zip(changedContent,diffs)
  seedOwner(token,main_user)
  seedUsers(token,users)
  seedPermissions(token,DocumentId,[main_user],true)
  seedPermissions(token,DocumentId,users,false)
  seedDocuments(token,DocumentId,SectionIds,CatergoryId,Organisation_Id)
  seedSections(token,DocumentId,content)
  seedChanges(token,DocumentId,users,changes)
  const commitid = seedCommits(token,DocumentId,users,diffs)
  seedMerges(token,DocumentId,commitid,main_user)
  // console.log(changes)

}


seeddb()







// exports ={}

