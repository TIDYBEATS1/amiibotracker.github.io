
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <Header
      totalCount={0}
      ownedCount={0}
      wishlistedCount={0}
      isLoggedIn={false}
    />
    <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Welcome to <span className="text-primary">FigureDex</span>
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground">
          Your ultimate companion for tracking your Amiibo collection. Never miss a figure again!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/all">Browse All Figures</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Login to Your Account</Link>
          </Button>
        </div>
      </div>
    </main>
    </>
  );
}
