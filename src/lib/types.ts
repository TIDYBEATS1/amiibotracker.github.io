export type Amiibo = {
  id: string;
  head: string;
  tail: string;
  name: string;
  series: string;
  releaseDate: {
    northAmerica: string | null;
    europe: string | null;
    japan: string | null;
  };
  gameCompatibilities: {
    game: string;
    usage: string;
  }[];
  imageUrl: string;
};

export const CollectionStatus = {
  OWNED: "owned",
  WISHLISTED: "wishlisted",
} as const;

export type CollectionStatusType = typeof CollectionStatus[keyof typeof CollectionStatus];

export type Collection = Record<string, CollectionStatusType>;
