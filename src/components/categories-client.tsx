
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Amiibo, Collection, CollectionStatusType } from "@/lib/types";
import type { GroupedAmiibos } from "@/app/categories/page";
import { useToast } from "@/hooks/use-toast";
import { AmiiboGrid } from "./amiibo-grid";
import { AmiiboDetailDialog } from "./amiibo-detail-dialog";

type CategoriesClientProps = {
  groupedAmiibos: GroupedAmiibos;
};

export function CategoriesClient({ groupedAmiibos }: CategoriesClientProps) {
  const [collection, setCollection] = useState<Collection>({});
  const [selectedAmiibo, setSelectedAmiibo] = useState<Amiibo | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

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

  return (
    <>
      <Accordion type="multiple" className="w-full">
        {Object.entries(groupedAmiibos).map(([series, amiibos]) => (
          <AccordionItem key={series} value={series}>
            <AccordionTrigger className="text-xl font-semibold hover:no-underline">
              {series} ({amiibos.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4">
                <AmiiboGrid
                  amiibos={amiibos}
                  collection={collection}
                  onStatusChange={handleStatusChange}
                  onAmiiboSelect={setSelectedAmiibo}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <AmiiboDetailDialog
        amiibo={selectedAmiibo}
        isOpen={!!selectedAmiibo}
        onOpenChange={(isOpen) => !isOpen && setSelectedAmiibo(null)}
      />
    </>
  );
}
