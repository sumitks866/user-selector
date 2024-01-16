import React from "react";

export interface SelectOptionProps {
  children: React.ReactNode;
  value: any;
  isFocused?: boolean;
  onClick: () => void;
}

export default function SelectOption({
  children,
  isFocused,
  onClick,
}: SelectOptionProps) {
  return (
    <li
      className={`p-2 cursor-pointer hover:bg-gray-200 ${
        isFocused && "bg-gray-200"
      }`}
      onClick={onClick}
    >
      {children}
    </li>
  );
}
