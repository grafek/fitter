import Link from "next/link";
import { highlightSearchTerm } from "../../utils";

type SearchItemProps = {
  itemId: string;
  itemName: string;
  searchItem: string;
  searchQuery: string;
};

const SearchBarItem: React.FC<SearchItemProps> = ({
  itemId,
  itemName,
  searchItem,
  searchQuery,
}) => {
  return (
    <li className="rounded-md border-gray-300 hover:bg-gray-100 dark:hover:bg-slate-900">
      <Link href={`/${itemName}/${itemId}`} className="inline-block w-full p-2">
        {highlightSearchTerm(searchItem, searchQuery)}
      </Link>
    </li>
  );
};

export default SearchBarItem;
