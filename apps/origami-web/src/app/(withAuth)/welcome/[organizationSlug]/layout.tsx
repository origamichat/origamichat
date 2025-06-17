export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    organizationSlug: string;
  }>;
}>) {
  return (
    <section className="flex h-screen w-screen items-center justify-center">
      {children}
    </section>
  );
}
