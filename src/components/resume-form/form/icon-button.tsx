"use client";

import { cn } from "@/lib/utils";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowSmallUpIcon,
  ArrowSmallDownIcon,
  TrashIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

type ReactButtonProps = React.ComponentProps<"button">;

const IconButtonBase = ({
  className,
  size = "medium",
  children,
  ...props
}: ReactButtonProps & {
  size?: "small" | "medium";
}) => (
  <button
    type="button"
    className={cn(
      "rounded-full outline-none hover:bg-zinc-800 focus-visible:bg-zinc-800",
      size === "medium" ? "p-1.5" : "p-1",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export const ShowIconButton = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) => {
  const label = show ? "Hide section" : "Show section";
  const onClick = () => setShow(!show);
  const Icon = show ? EyeIcon : EyeSlashIcon;

  return (
    <IconButtonBase onClick={onClick}>
      <Icon className="h-6 w-6 text-zinc-500" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </IconButtonBase>
  );
};

type MoveIconButtonType = "up" | "down";

export const MoveIconButton = ({
  type,
  size = "medium",
  onClick,
}: {
  type: MoveIconButtonType;
  size?: "small" | "medium";
  onClick: (type: MoveIconButtonType) => void;
}) => {
  const label = type === "up" ? "Move up" : "Move down";
  const sizeClassName = size === "medium" ? "h-6 w-6" : "h-4 w-4";
  const Icon = type === "up" ? ArrowSmallUpIcon : ArrowSmallDownIcon;

  return (
    <IconButtonBase onClick={() => onClick(type)} size={size}>
      <Icon className={`${sizeClassName} text-zinc-500`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </IconButtonBase>
  );
};

export const DeleteIconButton = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  return (
    <IconButtonBase onClick={onClick} size="small">
      <TrashIcon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
      <span className="sr-only">Delete</span>
    </IconButtonBase>
  );
};

export const BulletListIconButton = ({
  onClick,
  showBulletPoints,
}: {
  onClick: (newShowBulletPoints: boolean) => void;
  showBulletPoints: boolean;
}) => {
  return (
    <IconButtonBase
      onClick={() => onClick(!showBulletPoints)}
      size="small"
      className={showBulletPoints ? "!bg-zinc-700" : ""}
    >
      <ListBulletIcon
        className={`h-4 w-4 ${
          showBulletPoints ? "text-zinc-200" : "text-zinc-500"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">{showBulletPoints ? "Hide bullet points" : "Show bullet points"}</span>
    </IconButtonBase>
  );
};
