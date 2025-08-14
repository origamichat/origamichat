import { useSupport } from "@cossistant/react";
import { useMemo } from "react";
import { cn } from "../utils";
import { CossistantLogo } from "./cossistant-branding";

export interface WatermarkProps {
  className?: string;
}

export const Watermark: React.FC<WatermarkProps> = ({ className }) => {
  const { website } = useSupport();

  const cossistantUrl = useMemo(() => {
    if (!website) {
      return "https://cossistant.com";
    }

    const url = new URL("https://cossistant.com");

    url.searchParams.set("ref", "chatbox");
    url.searchParams.set("domain", website.domain);
    url.searchParams.set("name", website.name);

    return url.toString();
  }, [website]);

  return (
    <a
      className={cn(
        "flex items-center gap-1.5 font-medium font-mono text-co-primary hover:text-co-blue",
        className
      )}
      href={cossistantUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="text-co-muted-foreground text-xs">We run on</span>
      <CossistantLogo className="h-3" />
    </a>
  );
};
