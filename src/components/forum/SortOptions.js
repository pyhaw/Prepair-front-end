import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const SortOptions = ({ setSortBy, sortBy = "newest" }) => {
  const sortOptions = {
    "newest": "Newest",
    "popular": "Popular",
    "trending": "Trending"
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-between bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-orange-500">
          {sortOptions[sortBy]} <ChevronDown size={16} className="ml-2 text-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-md border mt-1 w-36">
          {Object.entries(sortOptions).map(([key, label]) => (
            <DropdownMenuItem 
              key={key}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                sortBy === key ? "text-orange-500 font-medium" : "text-gray-700"
              }`} 
              onClick={() => handleSortChange(key)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortOptions;