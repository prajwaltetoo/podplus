import React, { useEffect, useState } from "react";
import "./style.css";

const FileInput = ({ id, accept, onFileSelected, text, file, required }) => {
    const [fileSelected, setFileSelected] = useState(false);
    
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelected(e.target.files[0]);
            setFileSelected(e.target.files[0].name);
        }
    };

    useEffect(() => {
        if(!file){
            setFileSelected(false);
        } 
    }, [file])

    return (
        <>
        <input
            type="file"
            accept={accept}
            id={id}
            onChange={handleFileChange}
            required={required}
            style={{ display: "none" }}
        />
        <label htmlFor={id} className={`custom-input-file-button ${fileSelected?'selected':''}`}>
            <span>
                {fileSelected ? `Uploaded ${text} "${fileSelected}"` :`Upload ${text}`}
            </span>
        </label>
        </>
    );
};

export default FileInput;