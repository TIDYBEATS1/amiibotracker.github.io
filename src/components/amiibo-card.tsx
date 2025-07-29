
"use client";

import Image from "next/image";
import type { Amiibo, CollectionStatusType } from "@/lib/types";
import { CollectionStatus } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle2, Ellipsis, Heart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AmiiboCardProps = {
  amiibo: Amiibo;
  status: CollectionStatusType | null;
  onStatusChange: (status: CollectionStatusType | null) => void;
  onSelect: () => void;
};

export function AmiiboCard({ amiibo, status, onStatusChange, onSelect }: AmiiboCardProps) {
  const StatusBadge = () => {
    if (status === CollectionStatus.OWNED) {
      return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Owned</Badge>;
    }
    if (status === CollectionStatus.WISHLISTED) {
      return <Badge variant="default" className="bg-sky-600 hover:bg-sky-700">Wishlist</Badge>;
    }
    return null;
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-0">
        <button onClick={onSelect} className="block w-full aspect-[3/4] relative">
          <Image
            src={amiibo.imageUrl}
            alt={amiibo.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain"
            data-ai-hint={`${amiibo.series} figure`}
          />
          <div className="absolute top-2 right-2">
            <StatusBadge />
          </div>
        </button>
      </CardContent>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <h3 className="text-base font-semibold truncate" title={amiibo.name}>{amiibo.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{amiibo.series}</p>
        </div>
        <div className="pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto w-full">
                <Ellipsis className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onStatusChange(CollectionStatus.OWNED)}>
                <CheckCircle2 className={cn("mr-2 h-4 w-4", status === CollectionStatus.OWNED && "text-primary")} />
                <span>Mark as Owned</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onStatusChange(CollectionStatus.WISHLISTED)}>
                <Heart className={cn("mr-2 h-4 w-4", status === CollectionStatus.WISHLISTED && "text-primary")} />
                <span>Add to Wishlist</span>
              </DropdownMenuItem>
              {status && (
                <DropdownMenuItem onSelect={() => onStatusChange(null)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Remove from Collection</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
