import MarkdownRendrer from "./MarkdownRenderer";

const MarkdownCell = ({text}:any) => {
    return ( 
        <div className="flex flex-col hover:rounded-sm bg-white hover:border hover:border-blue-300">
            <MarkdownRendrer  text={text}></MarkdownRendrer>
        </div>
     );
}
 
export default MarkdownCell;