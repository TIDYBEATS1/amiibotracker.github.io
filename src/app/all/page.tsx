
import { FigureDexClient } from '@/components/figure-dex-client';
import type { Amiibo } from '@/lib/types';

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

export default async function AllAmiiboPage() {
  const amiibos = await getAmiibos();

  return (
      <FigureDexClient amiibos={amiibos} />
  );
}
