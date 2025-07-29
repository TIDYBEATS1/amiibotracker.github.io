
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Amiibo, Collection, CollectionStatusType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Header } from "./header";
import { AmiiboGrid } from "./amiibo-grid";
import { AmiiboDetailDialog } from "./amiibo-detail-dialog";
import { usePathname } from "next/navigation";

type FigureDexClientProps = {
  amiibos: Amiibo[];
};

export function FigureDexClient({ amiibos }: FigureDexClientProps) {
  const [collection, setCollection] = useState<Collection>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAmiibo, setSelectedAmiibo] = useState<Amiibo | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  
  // TODO: Replace with real authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedCollection = localStorage.getItem("figureDexCollection");
      if (storedCollection) {
        setCollection(JSON.parse(storedCollection));
      }
    } catch (error) {
      console.error("Failed to load collection from localStorage", error);
      toast({
        title: "Error",
        description: "Could not load your collection from local storage.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("figureDexCollection", JSON.stringify(collection));
      } catch (error) {
        console.error("Failed to save collection to localStorage", error);
        toast({
          title: "Error",
          description: "Could not save your collection changes.",
          variant: "destructive",
        });
      }
    }
  }, [collection, isMounted, toast]);

  const handleStatusChange = useCallback((amiiboId: string, status: CollectionStatusType | null) => {
    setCollection((prev) => {
      const newCollection = { ...prev };
      if (status) {
        newCollection[amiiboId] = status;
      } else {
        delete newCollection[amiiboId];
      }
      return newCollection;
    });
  }, []);

  const filteredAmiibos = useMemo(() => {
    return amiibos.filter((amiibo) =>
      amiibo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amiibo.series.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [amiibos, searchQuery]);

  const collectionCounts = useMemo(() => {
    return Object.values(collection).reduce(
      (acc, status) => {
        if (status === 'owned') acc.owned += 1;
        if (status === 'wishlisted') acc.wishlisted += 1;
        return acc;
      },
      { owned: 0, wishlisted: 0 }
    );
  }, [collection]);

  return (
    <div className="w-full">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={amiibos.length}
        ownedCount={collectionCounts.owned}
        wishlistedCount={collectionCounts.wishlisted}
        isLoggedIn={isLoggedIn}
      />
      <main className="container max-w-screen-2xl py-6">
        <AmiiboGrid
          amiibos={filteredAmiibos}
          collection={collection}
          onStatusChange={handleStatusChange}
          onAmiiboSelect={setSelectedAmiibo}
        />
      </main>
      <AmiiboDetailDialog
        amiibo={selectedAmiibo}
        isOpen={!!selectedAmiibo}
        onOpenChange={(isOpen) => !isOpen && setSelectedAmiibo(null)}
      />
    </div>
  );
}
