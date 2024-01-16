"use client";
import UserSelector from "@/components/UserSelector";
import { users } from "@/mock";
import { IUser } from "@/types";
import { useState } from "react";

export default function Home() {
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const handleSelectedUsersListChange = (users: IUser[]) => {
    setSelectedUsers(users);
  };

  return (
    <main className="flex min-h-screen overflow-scroll flex-col items-center p-24 text-[13px]">
      <h1 className="mb-8 font-semibold text-[32px]">User Selection</h1>
      <UserSelector
        usersList={users}
        selectedUsers={selectedUsers}
        onChange={handleSelectedUsersListChange}
      />
    </main>
  );
}
