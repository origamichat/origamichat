import * as React from "react";

export interface CossistantProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface CossistantContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CossistantContext = React.createContext<
  CossistantContextValue | undefined
>(undefined);

export function CossistantProvider({
  children,
  defaultOpen = false,
}: CossistantProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((o) => !o), []);

  const value = React.useMemo<CossistantContextValue>(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle]
  );

  return (
    <CossistantContext.Provider value={value}>
      {children}
    </CossistantContext.Provider>
  );
}

export function useCossistant() {
  const context = React.useContext(CossistantContext);
  if (!context) {
    throw new Error("useCossistant must be used within a CossistantProvider");
  }
  return context;
}
