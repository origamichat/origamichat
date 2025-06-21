import { SignInButtons } from "@/components/auth/sign-in-buttons";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Origami</h1>
      <p>You&apos;re not signed-in</p>
      <SignInButtons />
    </div>
  );
}
