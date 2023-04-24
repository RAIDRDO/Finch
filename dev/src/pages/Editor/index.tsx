import EditorCell from "@/components/ui/EditorCell";
const Editor = () => {
    return ( 
        <div className="flex justify-center">
        <div className="flex flex-col w-9/12 h-full bg-slate-50">
            <EditorCell></EditorCell>
        </div>
        </div>

     );
}
 
export default Editor;