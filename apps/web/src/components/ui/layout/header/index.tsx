type HeaderProps = {
  children: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex h-14 w-full items-center justify-between px-6 text-medium text-sm">
      {children}
    </header>
  );
}
