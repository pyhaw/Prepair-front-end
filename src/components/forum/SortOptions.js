import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const SortOptions = ({ setSortBy }) => {
  const [selectedSort, setSelectedSort] = useState("Newest");

  const handleSortChange = (value) => {
    setSortBy(value);
    setSelectedSort(value);
  };

  return (
    <div className="relative inline-block text-left mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-between bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-md text-gray-700 text-lg hover:bg-gray-100 focus:ring-2 focus:ring-orange-500">
          {selectedSort} <ChevronDown size={18} className="ml-2 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-md border mt-1 w-48">
          <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => handleSortChange("Newest")}>
            Newest
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => handleSortChange("Popular")}>
            Popular
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700" onClick={() => handleSortChange("Trending")}>
            Trending
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortOptions;
