import { IUser } from "@/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import UserSelectCard from "./UserSelectCard";
import Chip from "./Chip";
import SelectOption from "./SelectOption";
import { useMediaQuery } from "react-responsive";

interface IUserSelectorProps {
  usersList: IUser[];
  selectedUsers: IUser[];
  onChange: (users: IUser[]) => void;
}

export default function UserSelector({
  usersList,
  selectedUsers,
  onChange,
}: IUserSelectorProps) {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [highlightLastUser, setHighlightLastUser] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const backspaceCountRef = useRef(0);

  const onRemoveUser = (user: IUser) => {
    onChange(selectedUsers.filter((u) => u.email !== user.email));
  };

  const handleUserSelection = (user: IUser) => {
    setQuery("");
    inputRef.current?.focus();
    const isUserAlreadySelected =
      selectedUsers.find((u) => u.email === user.email) !== undefined; // do not select user if they are already selected
    if (!isUserAlreadySelected) onChange([...selectedUsers, user]);
  };

  const filterUsers = (q: string): IUser[] => {
    const userRegex = new RegExp(
      q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    return usersList
      .filter(
        (user) =>
          userRegex.test(`${user.firstName} ${user?.lastName || ""}`) ||
          userRegex.test(user.username) ||
          userRegex.test(user.email)
      )
      .filter((user) => !selectedUsers.some((u) => u.email === user.email)) // remove users who are already selected
      .slice(0, 10);
  };

  const filteredUsersList: IUser[] = useMemo(
    () => filterUsers(query),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, selectedUsers]
  ); // get new user list when query changes

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //if user presses backspace and query is empty
    if (e.key === "Backspace" && query === "") {
      backspaceCountRef.current += 1;
      console.log("backspace");
      if (backspaceCountRef.current === 1) {
        setHighlightLastUser(true);
      } else if (backspaceCountRef.current === 2) {
        onChange(selectedUsers.slice(0, -1));
        setHighlightLastUser(false);
        backspaceCountRef.current = 0;
      }
    } else {
      // else handle menu navigation
      setHighlightLastUser(false);
      backspaceCountRef.current = 0;

      if (e.key === "ArrowDown") {
        if (focusedIndex < filteredUsersList.length - 1)
          setFocusedIndex((prev) => prev + 1);
        else setFocusedIndex(0);
      } else if (e.key === "ArrowUp") {
        if (focusedIndex > 0) setFocusedIndex((prev) => prev - 1);
        else setFocusedIndex(filteredUsersList.length - 1);
      } else if (e.key === "Enter" && focusedIndex !== -1) {
        handleUserSelection(filteredUsersList[focusedIndex]);
      }
    }
  };

  //to close select menu when user clicks somewhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSelectOpen]);

  //to scroll the focused option into view
  useEffect(() => {
    if (listRef.current && focusedIndex !== -1) {
      const focusedItem = listRef.current.children[focusedIndex];
      focusedItem && focusedItem.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  return (
    <div
      className={`flex flex-wrap items-center py-1 min-h-fit ${
        isMobile ? "w-full" : "max-w-[60%]"
      } border-b-2 border-black bg-white bg-opacity-10`}
      ref={selectRef}
    >
      {selectedUsers.map((user, id) => (
        <div key={user.email} className="mx-1">
          <Chip
            onClose={() => onRemoveUser(user)}
            isHighlighted={highlightLastUser && id === selectedUsers.length - 1}
          >
            <UserSelectCard user={user} />
          </Chip>
        </div>
      ))}

      <div className="relative">
        <input
          className="px-2 py-2 focus:outline-none w-[300px] bg-transparent"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Add new user"
          onClick={() => setIsSelectOpen((pre) => !pre)}
          onKeyDown={(e) => handleInputKeyPress(e)}
          ref={inputRef}
        />
        {isSelectOpen && (
          <ul
            className="absolute top-full left-0 mt-2 w-full bg-white border-t border-gray-300 rounded-b-md shadow-md z-10 p-2 max-h-[300px] overflow-y-auto"
            ref={listRef}
          >
            {filteredUsersList.length > 0 ? (
              filteredUsersList.map((user, id) => (
                <SelectOption
                  key={user.username}
                  isFocused={focusedIndex === id}
                  value={user}
                  onClick={() => handleUserSelection(user)}
                >
                  <UserSelectCard user={user} showEmail />
                </SelectOption>
              ))
            ) : (
              <li>No matches found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
