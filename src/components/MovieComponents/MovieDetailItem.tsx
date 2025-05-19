import { ComponentPropsWithoutRef, FC } from "react";

interface Props extends ComponentPropsWithoutRef<"div"> {
  title: string;
  value: string[] | string | number;
}

export const MovieDetailItem: FC<Props> = ({ title, value }) => {
  let textContent: string;
  if (Array.isArray(value)) {
    textContent = value.join(", ");
  } else if (typeof value === "number") {
    textContent = `${value} minutes`;
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(value);
    textContent = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } else {
    textContent = value;
  }
  return (
    <div className="mb-3">
      <p className="text-[18px] text-gray-400">{title}</p>
      <p className="text-[18px] text-white">{textContent}</p>
    </div>
  );
};
