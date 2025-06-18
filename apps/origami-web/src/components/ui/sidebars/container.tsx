type Props = {
  children: React.ReactNode;
};

export function SidebarContainer({ children }: Props) {
  return (
    <div className="h-screen p-2">
      <div className="flex h-full max-w-2xs border rounded-2xl p-2 w-full">
        {children}
      </div>
    </div>
  );
}
