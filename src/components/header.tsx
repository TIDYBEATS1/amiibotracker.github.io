
"use client";

import { LogIn, Search, X, User } from "lucide-react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type HeaderProps = {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  totalCount: number;
  ownedCount: number;
  wishlistedCount: number;
  isLoggedIn?: boolean;
};

export function Header({
  searchQuery,
  onSearchChange,
  totalCount,
  ownedCount,
  wishlistedCount,
  isLoggedIn = false
}: HeaderProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isHomePage = pathname === '/';
  const isCategoriesPage = pathname === '/categories';
  const showSearch = !isLoginPage && !isCategoriesPage && onSearchChange && typeof searchQuery !== 'undefined';


  const navLinkClasses = (href: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      pathname === href ? "text-primary" : "text-muted-foreground"
    );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center">
          <Icons.logo className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-lg font-bold tracking-tight font-headline">FigureDex</h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={navLinkClasses("/")}>All Amiibo</Link>
          <Link href="/categories" className={navLinkClasses("/categories")}>Categories</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
            {showSearch && (
              <>
                <div className="w-full flex-1 md:w-auto md:flex-none max-w-xs">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search figures..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {searchQuery && (
                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => onSearchChange('')}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
              </>
            )}
            {isLoggedIn ? (
                <Link href="/account" passHref>
                    <Button variant="outline">
                        <User className="mr-2 h-4 w-4" />
                        <span>Account</span>
                    </Button>
                </Link>
            ) : (
                !isLoginPage && (
                  <Link href="/login" passHref>
                    <Button>
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </Button>
                  </Link>
                )
            )}
        </div>
      </div>
      {!isLoginPage && !isCategoriesPage && (
        <div className="container max-w-screen-2xl">
          <div className="text-sm text-muted-foreground pb-2 flex gap-4">
              <span>Total: <strong>{totalCount}</strong></span>
              <span>Owned: <strong className="text-green-500">{ownedCount}</strong></span>
              <span>Wishlist: <strong className="text-sky-500">{wishlistedCount}</strong></span>
          </div>
        </div>
      )}
    </header>
  );
}
