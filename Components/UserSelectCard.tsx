/* eslint-disable @next/next/no-img-element */
import { IUser } from "@/types";
import React from "react";
import { AvatarGenerator } from "random-avatar-generator";

interface IProps {
  user: IUser;
  showEmail?: boolean;
}

export default function UserSelectCard({ user, showEmail }: IProps) {
  const avatarGenerator = new AvatarGenerator();
  return (
    <div className="w-full flex items-center">
      <img
        src={avatarGenerator.generateRandomAvatar(user.email)}
        alt={user.email}
        className={`h-8 mr-2`}
      />
      <div>
        <div className="whitespace-nowrap">
          {user.firstName} {user?.lastName}
        </div>
        {showEmail && (
          <div className="text-[12px] text-gray-600">{user.email}</div>
        )}
      </div>
    </div>
  );
}
