import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import {
  AiOutlineSearch,
  AiOutlineUnorderedList,
  AiOutlineUser,
} from "react-icons/ai";
import { sleep } from "../../utils";
import { Button, Loading } from "../ui";
import {
  useClickOutside,
  useDebounceValue,
  useInfinitePosts,
  useInfiniteUsers,
} from "../../hooks";
import { SEARCH_LIMIT } from "../../utils/globals";
import type { RouterInputs } from "../../utils/trpc";
import SearchBarCategory from "./SearchBarCategory";
import SearchBarItem from "./SearchBarItem";

const LIST_HIDDEN_CLASSES = "opacity-0 scale-75 -z-50";
const LIST_VISIBLE_CLASSES = "opacity-100 scale-100";

const INPUT_HIDDEN_CLASSES =
  "opacity-0 -z-20 sm:-translate-x-10 translate-x-10";
const INPUT_VISIBLE_CLASSES = "opacity-100";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [isVisible, setIsVisible] = useState(false);

  const [animationClassess, setAnimationClasses] =
    useState(LIST_HIDDEN_CLASSES);

  const [inputAnimations, setInputAnimations] = useState(INPUT_HIDDEN_CLASSES);

  const { data: session } = useSession();

  const formRef = useRef<HTMLFormElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const isSession = session?.user ? true : false;

  const debouncedSearchQuery = useDebounceValue(searchQuery, 500);

  const postInputData: RouterInputs["post"]["infinitePosts"] = {
    limit: SEARCH_LIMIT,
    where: {
      title: {
        contains: debouncedSearchQuery,
      },
    },
  };

  const userInputData: RouterInputs["user"]["infiniteUsers"] = {
    limit: SEARCH_LIMIT,
    where: {
      name: {
        contains: debouncedSearchQuery,
      },
    },
  };

  const {
    data: posts,
    isFetching: postsFetching,
    hasNextPage: hasMorePosts,
    fetchNextPage: fetchMorePosts,
  } = useInfinitePosts({
    input: postInputData,
    enabled: isVisible && debouncedSearchQuery.trim().length > 0,
  });

  const {
    data: users,
    isFetching: usersFetching,
    hasNextPage: hasMoreUsers,
    fetchNextPage: fetchMoreUsers,
  } = useInfiniteUsers({
    input: userInputData,
    enabled: isVisible && debouncedSearchQuery.trim().length > 0 && isSession,
  });

  useClickOutside(formRef, async () => {
    setAnimationClasses("opacity-0 scale-75 -translate-y-10 -z-40");
    setInputAnimations("opacity-0 -z-20 sm:-translate-x-10 translate-x-10");
    await sleep();
    setIsVisible(false);
  });

  const filteredUsers =
    users && session ? users.pages.flatMap((page) => page.users) : [];

  const filteredPosts = posts ? posts.pages.flatMap((page) => page.posts) : [];

  const onQueryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      setIsVisible(true);
      await sleep();
      setAnimationClasses(LIST_VISIBLE_CLASSES);
    }
    if (e.target.value.trim().length === 0) {
      setAnimationClasses(LIST_HIDDEN_CLASSES);
    }
  };

  const toggleInput = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsVisible(true);
    await sleep();
    if (isVisible) {
      setInputAnimations(INPUT_HIDDEN_CLASSES);
      await sleep();
      setIsVisible(false);
    } else {
      setInputAnimations(INPUT_VISIBLE_CLASSES);
      inputRef.current?.focus();
    }
  };

  return (
    <form
      ref={formRef}
      className="relative ml-auto mr-3 flex items-center sm:mr-8"
    >
      {isVisible ? (
        <input
          role={"searchbox"}
          ref={inputRef}
          className={`${inputAnimations}  absolute -left-5 w-28 rounded-md bg-gray-200 px-4 py-2  pl-10 text-gray-800 transition-all duration-300 focus:outline-none dark:bg-gray-800 dark:text-gray-200 sm:static sm:inline-block sm:w-max sm:pl-3`}
          type="text"
          value={searchQuery}
          onChange={onQueryChange}
          placeholder="Search users & posts"
        />
      ) : null}

      <Button
        onClick={toggleInput}
        className={`absolute -right-5 rounded-md p-2 outline-none sm:bg-indigo-500 sm:hover:bg-indigo-600 dark:sm:bg-indigo-800 sm:dark:hover:bg-indigo-700`}
      >
        <AiOutlineSearch
          size={"1.5rem"}
          className="text-black dark:text-white"
        />
      </Button>
      <div
        className={`absolute -left-4 top-8 max-h-[350px] min-w-[120px] overflow-y-auto rounded-lg border border-[#d0d7de] bg-[#f6f8fa] px-2 py-2 transition-all dark:border-[#30363d] dark:bg-[#171f42]/90 sm:left-0 sm:top-12 sm:w-full ${animationClassess}`}
      >
        {filteredUsers.length > 0 ? (
          <SearchBarCategory Icon={AiOutlineUser} category="Users" />
        ) : null}
        <ul className="divide-y dark:divide-[#30363d]">
          {filteredUsers.map((user) => (
            <SearchBarItem
              key={user.id}
              itemName={"profile"}
              itemId={user.id}
              searchItem={user.name}
              searchQuery={searchQuery}
            />
          ))}
          {hasMoreUsers ? (
            <Button
              className="my-2 w-full"
              buttonColor="primary"
              onClick={(e) => {
                e.preventDefault();
                fetchMoreUsers();
              }}
            >
              See more users..
            </Button>
          ) : null}
        </ul>
        {filteredPosts.length > 0 ? (
          <SearchBarCategory Icon={AiOutlineUnorderedList} category="Posts" />
        ) : null}
        <ul className="divide-y dark:divide-[#30363d]">
          {filteredPosts.map((post) => (
            <SearchBarItem
              itemName={"post"}
              key={post.id}
              itemId={post.id}
              searchItem={post.title}
              searchQuery={searchQuery}
            />
          ))}
          {hasMorePosts ? (
            <Button
              className="my-2 w-full"
              buttonColor="primary"
              onClick={(e) => {
                e.preventDefault();
                fetchMorePosts();
              }}
            >
              See more posts..
            </Button>
          ) : null}
        </ul>
        {postsFetching || usersFetching ? <Loading /> : null}
        {filteredPosts.length < 1 &&
        filteredUsers.length < 1 &&
        (!postsFetching || !usersFetching) ? (
          <h2 className="py-4 text-center font-semibold sm:text-xl">
            No match found :(
          </h2>
        ) : null}
      </div>
    </form>
  );
};

export default SearchBar;
