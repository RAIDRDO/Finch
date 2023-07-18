import ReactMarkdown from 'react-markdown'
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from 'remark-gfm'
import remarkMermaid from "@/lib/remark-mermaid-v2";

const MarkdownRendrer = ({text}:any) => {
    const rehypePlugins :any = [rehypeRaw,rehypeStringify]
    const remarkPlugins :any = [remarkGfm,remarkMermaid]
    return ( 
        <div className="prose break-words p-4 overflow-y-auto">
             <ReactMarkdown
            children={text}
            remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}
          />
        </div>
     );
}
 
export default MarkdownRendrer;