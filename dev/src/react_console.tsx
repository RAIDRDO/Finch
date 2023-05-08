import {useState,useEffect} from 'react';
// import Console_fab from './console_fab';
// import Console_panel from './console_panel' 
import objectInspect from "object-inspect";
import { nanoid } from 'nanoid';
import {Logs} from './shared/types'

const Console_log_item = ({index,log_type,log_msg}:Logs) => {
    return ( 
        <>
           

           {log_type ==="log" ?
             <div key={index} className='border-solid border-l-8  border-l-green-500  border-y border-slate-700 hover:bg-slate-700 '>
                    <p className="ml-2 font-mono text-white">{log_msg}</p> 
            </div>
            :  log_type==="error"? 
             <div key={index} className='border-solid border-l-8  border-l-rose-500  border-y border-slate-700 hover:bg-slate-700 '>
                    <p className="ml-2 font-mono text-white">{log_msg}</p> 
            </div>
            :  log_type==="warn"? 
             <div key={index} className='border-solid border-l-8  border-l-yellow-500  border-y border-slate-700 hover:bg-slate-700 '>
                    <p className="ml-2 font-mono text-white">{log_msg}</p> 
            </div>
            :
             <div key={index} className='border-solid border-l-8  border-l-cyan-500  border-y border-slate-700 hover:bg-slate-700 '>
                    <p className="ml-2 font-mono text-white">{log_msg}</p> 
            </div>

        }
           
          
        </>
     );
}


const Console_panel = ({savedlogs,setToggled}:{savedlogs:Logs[],setToggled:Function}) => {
    return ( 
        <div className={'container shadow-sm mx-auto rounded-lg bg-gray-900 z-[99999] fixed bottom-0 right-0 left-0 max-w-6xl h-96 max-h-96 transition-all duration-150 ease-in-out  '}>
            <div className='bg-gray-800 h-16 sticky top-0 rounded-lg'>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9 m-2 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <button className="float-right focus:outline-none rounded-tr-lg text-white focus:bg-red-400 bg-rose-600 hover:bg-red-500 font-medium font-mono border-0 text-sm px-4 py-1.5" onClick={()=>(setToggled(false))}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>


            </button>
            </div>
          <div className="overflow-auto scrollbar h-80">
                {savedlogs.map((log:Logs,index:number)=>(
                    <Console_log_item key={index} {...log}></Console_log_item>
                  
            ))}
            </div>
           

        </div>

     )
}
 


const Console_fab = ({logcount,setToggled}:{logcount:number,setToggled: (value: boolean) => void;}) => {
    return ( 
        <div className="  fixed bottom-0 right-0 z-[99999] flex flex-row text-center">
            <button onClick={()=>{setToggled(true)}} className="rounded-full w-16 h-16 mb-8 mr-8 border-0 bg-slate-900 hover:bg-slate-800  focus:bg-gray-700 shadow-lg shadow-slate-200">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>

                {logcount>0?<span className="animate-ping absolute top-1.5 right-0.5 mr-10 block h-1.5 w-1.5 rounded-full ring-2 ring-cyan-400-400 bg-cyan-600"></span>:<></> }


            </button>
        </div>
     );
}
 



const Console = () => {
const [savedLogs, setsavedLogs] = useState<Logs[]>([]);
const [Toggled, setToggled] = useState(false);

const reduceArgs = (formattedList: any[], arg: any) => [
  ...formattedList,
  objectInspect(arg),
];

const formatArgs = (args: any[]) => args.reduce(reduceArgs, []).join(" ");

useEffect(()=>{
function intercept(){
    const oldLog = console.log;
    const oldWarn = console.warn;
    const oldInfo = console.info;
    const oldError = console.error;
    // const oldClear = console.clear
    
    console.error = function (...args) {
        const formatedlogs = formatArgs(args)
        setsavedLogs(savedLogs=>[...savedLogs,{index:nanoid(),log_type:"error",log_msg:formatedlogs}])      
        oldError.call(console, ...args);
    };
    console.log = function (...args) {
        const formatedlogs = formatArgs(args)
        setsavedLogs(savedLogs=>[...savedLogs,{index:nanoid(),log_type:"log",log_msg:formatedlogs}])      
        oldLog.call(console, ...args);
    };

    console.warn = function (...args) {
        const formatedlogs = formatArgs(args)
        setsavedLogs(savedLogs=>[...savedLogs,{index:nanoid(),log_type:"warn",log_msg:formatedlogs}])      
        oldWarn.call(console, ...args);
    };

    console.info = function (...args) {
        const formatedlogs = formatArgs(args)
        setsavedLogs(savedLogs=>[...savedLogs,{index:nanoid(),log_type:"info",log_msg:formatedlogs}])      
        oldInfo.call(console, ...args);
    };

};intercept()
},[])

    
    
    return (
        <div>
        {Toggled ===true ? (<Console_panel setToggled={setToggled} savedlogs={savedLogs}></Console_panel>) : (<Console_fab logcount = {savedLogs.length} setToggled={setToggled}></Console_fab>)}

        </div>
    );
}
 
export default Console;