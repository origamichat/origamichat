import * as React from "react";

export interface ChatSendButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ChatSendButton = React.forwardRef<
	HTMLButtonElement,
	ChatSendButtonProps
>(({ className, ...props }, ref) => {
	return <button className={className} ref={ref} type="button" {...props} />;
});

ChatSendButton.displayName = "ChatSendButton";
