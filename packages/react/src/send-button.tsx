import * as React from "react";

export interface SendButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SendButton = React.forwardRef<HTMLButtonElement, SendButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button type="button" ref={ref} className={className} {...props} />
    );
  },
);

SendButton.displayName = "SendButton";
