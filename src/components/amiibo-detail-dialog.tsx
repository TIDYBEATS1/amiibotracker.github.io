
"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Amiibo } from "@/lib/types";
import {
  getAmiiboUsage,
  type AmiiboUsageOutput,
} from "@/ai/flows/get-amiibo-usage-flow";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

type AmiiboDetailDialogProps = {
  amiibo: Amiibo | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function AmiiboDetailDialog({
  amiibo,
  isOpen,
  onOpenChange,
}: AmiiboDetailDialogProps) {
  const [usage, setUsage] = useState<AmiiboUsageOutput["games"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !amiibo) {
      setUsage([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchUsage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usageData = await getAmiiboUsage({ id: amiibo.id });
        if (usageData && usageData.games) {
          setUsage(usageData.games);
        } else {
          setUsage([]);
        }
      } catch (e: any) {
        console.error("Failed to fetch amiibo usage", e);
        setError(e.message || "Could not load game compatibility data.");
        setUsage([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsage();
  }, [isOpen, amiibo]);


  if (!amiibo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] grid-rows-[auto_1fr] p-0 max-h-[90vh]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold font-headline">
            {amiibo.name}
          </DialogTitle>
          <DialogDescription>{amiibo.series} Series</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-6 bg-muted">
                <Image
                  src={amiibo.imageUrl}
                  alt={amiibo.name}
                  fill
                  className="object-contain"
                  data-ai-hint={`${amiibo.series} figure`}
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Release Dates</h3>
                <ul className="text-sm text-muted-foreground list-disc pl-4">
                  {amiibo.releaseDate.northAmerica && (
                    <li>North America: {amiibo.releaseDate.northAmerica}</li>
                  )}
                  {amiibo.releaseDate.europe && (
                    <li>Europe: {amiibo.releaseDate.europe}</li>
                  )}
                  {amiibo.releaseDate.japan && (
                    <li>Japan: {amiibo.releaseDate.japan}</li>
                  )}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Amiibo ID (for debugging)</h3>
                <p className="text-sm text-muted-foreground font-mono bg-muted/50 p-2 rounded-md">
                  {amiibo.id}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Game Compatibility</h3>
                <div className="space-y-2 text-sm">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : error ? (
                     <p className="text-destructive">{error}</p>
                  ) : usage.length > 0 ? (
                    usage.map((game, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-md">
                        <p className="font-medium text-foreground">
                          {game.game}
                        </p>
                        <p className="text-muted-foreground">{game.usage}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No game compatibility information found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
