
import { LoginForm } from "@/components/login-form";
import { Header } from "@/components/header";

export default function LoginPage() {
  return (
    <>
      <Header
        totalCount={0}
        ownedCount={0}
        wishlistedCount={0}
        isLoggedIn={false}
      />
      <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center p-4">
        <LoginForm />
      </main>
    </>
  );
}
