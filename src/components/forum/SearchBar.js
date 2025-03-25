import { useState } from "react";
import { X, Search } from "lucide-react";

const SearchBar = ({ setSearchQuery }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setInput("");
    setSearchQuery("");
  };

  return ( 
    <div className="w-full max-w-lg">
      <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-3 focus-within:ring-2 focus-within:ring-orange-500">
        <Search className="text-gray-400 mr-3" size={22} />
        <input
          type="text"
          placeholder="Search discussions..."
          value={input}
          onChange={handleInputChange}
          className="w-full bg-transparent focus:outline-none text-lg"
        />
        {input && (
          <button
            onClick={clearSearch}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
