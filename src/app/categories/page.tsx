
import { CategoriesClient } from '@/components/categories-client';
import type { Amiibo } from '@/lib/types';
import { Header } from '@/components/header';

async function getAmiibos(): Promise<Amiibo[]> {
  try {
    const response = await fetch('https://www.amiiboapi.com/api/amiibo/');
    if (!response.ok) {
      throw new Error('Failed to fetch amiibos');
    }
    const data = await response.json();

    // The API returns an object with an "amiibo" array
    return data.amiibo.map((item: any): Amiibo => ({
        id: `${item.head}${item.tail}`,
        head: item.head,
        tail: item.tail,
        name: item.character,
        series: item.amiiboSeries,
        releaseDate: {
            northAmerica: item.release.na || null,
            europe: item.release.eu || null,
            japan: item.release.jp || null,
        },
        gameCompatibilities: [],
        imageUrl: item.image,
    }));
  } catch (error) {
    console.error("Error fetching from Amiibo API:", error);
    return [];
  }
}

export type GroupedAmiibos = Record<string, Amiibo[]>;

export default async function CategoriesPage() {
  const amiibos = await getAmiibos();
  
  const groupedAmiibos = amiibos.reduce((acc, amiibo) => {
    const series = amiibo.series;
    if (!acc[series]) {
      acc[series] = [];
    }
    acc[series].push(amiibo);
    return acc;
  }, {} as GroupedAmiibos);

  const sortedGroupedAmiibos: GroupedAmiibos = Object.keys(groupedAmiibos)
    .sort()
    .reduce((obj, key) => {
      obj[key] = groupedAmiibos[key];
      return obj;
    }, {} as GroupedAmiibos);


  return (
    <>
      <Header totalCount={0} ownedCount={0} wishlistedCount={0} />
      <main className="container max-w-screen-2xl py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Amiibo by Series</h1>
          <p className="text-muted-foreground">Browse your favorite Amiibo series.</p>
        </div>
        <CategoriesClient groupedAmiibos={sortedGroupedAmiibos} />
      </main>
    </>
  );
}
