import type { IconType } from "react-icons/lib";

type SearchCategoryProps = {
  Icon: IconType;
  iconSize?: string;
  category: string;
};

const SearchBarCategory: React.FC<SearchCategoryProps> = ({
  Icon,
  iconSize = "1.5rem",
  category,
}) => {
  return (
    <div className="my-3 flex items-center gap-2">
      <span className="rounded-lg bg-gray-200 p-1 dark:bg-slate-800 sm:p-2">
        <Icon size={iconSize} />
      </span>
      <h2 className="text-lg font-bold">{category}</h2>
    </div>
  );
};
export default SearchBarCategory;
