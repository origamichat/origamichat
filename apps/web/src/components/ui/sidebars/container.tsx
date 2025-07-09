type Props = {
  children: React.ReactNode;
};

export function SidebarContainer({ children }: Props) {
  return (
    <div className="h-screen w-full p-2">
      <div className="flex h-full w-full rounded border p-2">{children}</div>
    </div>
  );
}
