"use client";
import UserSelector from "@/Components/UserSelector";
import { users } from "@/mock";
import { IUser } from "@/types";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const handleSelectedUsersListChange = (users: IUser[]) => {
    setSelectedUsers(users);
  };
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <main
      className={`flex min-h-screen w-full overflow-scroll flex-col items-center ${
        isMobile ? "p-24" : "p-8"
      } text-[13px]`}
    >
      <div className="text-center">
        <h1 className="mb-8 font-semibold text-[32px]">User Selection</h1>
      </div>
      <UserSelector
        usersList={users}
        selectedUsers={selectedUsers}
        onChange={handleSelectedUsersListChange}
      />
    </main>
  );
}
