import { useState,useEffect } from "react";
import EditorCell from "./EditorCell";
import MarkdownCell from "./MarkdownCell";
const MdEditor = (isedit:boolean) => {
    const [IsEdit, setIsEdit] = useState<boolean>(false);
    useEffect(() => {
        if (isedit) {
            setIsEdit(isedit);
        }
        else{
            setIsEdit(false);

        }
    }, [isedit])

    return ( 
        <div>
            {IsEdit ? <EditorCell></EditorCell> : 
            <MarkdownCell></MarkdownCell>
            }
        </div>
);
}
 
export default MdEditor;