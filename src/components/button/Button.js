import React from "react";
import "./style.css";

function Button({ text, type, disabled, onClick, style }) {
    return (
        <button className="custom-button" type={type} disabled={disabled} onClick={() => onClick()} style={style}>
            {text}
        </button>
    );
}

export default Button;