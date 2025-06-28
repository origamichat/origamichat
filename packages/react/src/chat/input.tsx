import * as React from "react";

export interface ChatInputProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ value, onChange, onSubmit, className, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(
      ref,
      () => innerRef.current as HTMLTextAreaElement
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit?.();
      }
      props.onKeyDown?.(e);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: re-run when value changes
    React.useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el) {
        return;
      }
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return (
      <textarea
        {...props}
        className={className}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={innerRef}
        rows={1}
        value={value}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";
