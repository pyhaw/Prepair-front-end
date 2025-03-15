import React from "react";

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 shadow-lg">
        {text}
      </div>
    </div>
  );
};

export { Tooltip };