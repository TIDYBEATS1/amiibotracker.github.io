"use client";

import type { Amiibo, Collection } from "@/lib/types";
import { AmiiboCard } from "./amiibo-card";

type AmiiboGridProps = {
  amiibos: Amiibo[];
  collection: Collection;
  onStatusChange: (amiiboId: string, status: "owned" | "wishlisted" | null) => void;
  onAmiiboSelect: (amiibo: Amiibo) => void;
};

export function AmiiboGrid({ amiibos, collection, onStatusChange, onAmiiboSelect }: AmiiboGridProps) {
  if (amiibos.length === 0) {
    return (
        <div className="text-center text-muted-foreground py-16">
            <h2 className="text-xl font-semibold">No figures found</h2>
            <p>Try adjusting your search query.</p>
        </div>
    )
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {amiibos.map((amiibo) => (
        <AmiiboCard
          key={amiibo.id}
          amiibo={amiibo}
          status={collection[amiibo.id] || null}
          onStatusChange={(status) => onStatusChange(amiibo.id, status)}
          onSelect={() => onAmiiboSelect(amiibo)}
        />
      ))}
    </div>
  );
}
