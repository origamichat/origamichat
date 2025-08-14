import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarPrimitive,
} from "../../primitive/avatar";
import { cn } from "../utils";

export function Avatar({
  className,
  image,
  name,
}: {
  className?: string;
  image?: string | null;
  name: string;
}) {
  return (
    <AvatarPrimitive
      className={cn(
        "flex size-9 items-center justify-center overflow-clip rounded-full bg-co-background-200 dark:bg-co-background-500",
        className
      )}
    >
      {image && <AvatarImage alt={name} src={image} />}
      <AvatarFallback className="font-medium text-xs" name={name} />
    </AvatarPrimitive>
  );
}
