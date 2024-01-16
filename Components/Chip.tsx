import React from "react";

interface IProps {
  children: React.ReactNode;
  isHighlighted?: boolean;
  onClose: () => void;
}

export default function Chip({ children, isHighlighted, onClose }: IProps) {
  return (
    <div
      className={`${
        isHighlighted ? "border-gray-600" : ""
      } border-2 bg-gray-300 rounded-full px-4 py-1 cursor-pointer min-w-fit flex items-center`}
    >
      <div>{children}</div>
      <div className="ml-4">
        <button className="text-gray-600 hover:text-black" onClick={onClose}>
          <i className="fa fa-times" />
        </button>
      </div>
    </div>
  );
}
