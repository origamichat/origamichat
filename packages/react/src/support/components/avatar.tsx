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
        "flex size-9 items-center justify-center overflow-clip rounded-full bg-co-background-200",
        className
      )}
    >
      {image && <AvatarImage alt={name} src={image} />}
      <AvatarFallback className="text-xs" name={name} />
    </AvatarPrimitive>
  );
}
