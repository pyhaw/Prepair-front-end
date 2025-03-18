import React from "react";

const Badge = ({ children, className = "" }) => {
    return (
        <span className={`bg-orange-500 text-white px-3 py-1 rounded-full ${className}`}>
            {children}
        </span>
    );
};

export { Badge };