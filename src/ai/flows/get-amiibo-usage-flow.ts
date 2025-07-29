
'use server';
/**
 * @fileOverview A utility for fetching Amiibo game usage from a local data source.
 *
 * - getAmiiboUsage - A function that fetches game compatibility for an Amiibo.
 * - AmiiboUsageInput - The input type for the getAmiiboUsage function.
 * - AmiiboUsageOutput - The return type for the getAmiiboUsage function.
 */
import { z } from 'zod';
import gameInfo from '@/lib/amiibo-games.json';

const AmiiboUsageInputSchema = z.object({
  id: z.string().describe("The 16-character ID of the Amiibo (head + tail)."),
});
export type AmiiboUsageInput = z.infer<typeof AmiiboUsageInputSchema>;

const AmiiboGameSchema = z.object({
    game: z.string().describe('The name of the game.'),
    usage: z.string().describe('How the Amiibo is used in the game.'),
});

const AmiiboUsageOutputSchema = z.object({
  games: z.array(AmiiboGameSchema),
});
export type AmiiboUsageOutput = z.infer<typeof AmiiboUsageOutputSchema>;

// A type guard to check if the value is an object with string keys and any values
function isObject(value: any): value is { [key: string]: any } {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function getAmiiboUsage(
  input: AmiiboUsageInput
): Promise<AmiiboUsageOutput> {
  try {
    const data = gameInfo.amiibos as { [key: string]: any };
    let foundGames: { game: string; usage: string }[] = [];

    // The data keys are prefixes. Find the key that the full ID starts with.
    // The most specific key should be found first.
    // Sort keys by length descending to ensure most specific match is found first
    const sortedKeys = Object.keys(data).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // Clean the key by removing the '0x' prefix if it exists
        const cleanedKey = key.startsWith('0x') ? key.substring(2) : key;
        
        if (input.id.toLowerCase().startsWith(cleanedKey.toLowerCase())) {
          const entry = data[key];
          
          // Handle nested platform structure (3DS, WiiU, Switch)
          if (isObject(entry.games)) {
               const platforms = ['3DS', 'WiiU', 'Switch'];
               platforms.forEach(platform => {
                   if (Array.isArray(entry.games[platform])) {
                       entry.games[platform].forEach((g: any) => {
                           // The game name can be in `name` or `game` property
                           const gameName = g.name || g.game;
                           if (gameName && g.usage) {
                              foundGames.push({ game: `${gameName} (${platform})`, usage: g.usage });
                           }
                       });
                   }
               });
          } 
          // Handle flat array structure
          else if (Array.isArray(entry.games)) {
              entry.games.forEach((g: any) => {
                  const gameName = g.name || g.game;
                  if (gameName && g.usage) {
                      foundGames.push({ game: gameName, usage: g.usage });
                  }
              });
          }
          
          // If we found games for a matching key, we can stop,
          // as we sorted the keys by most specific first.
          if (foundGames.length > 0) {
               break;
          }
        }
      }
    }
    
    return { games: foundGames };

  } catch (error) {
    console.error("Error in getAmiiboUsage:", error);
    // Re-throwing the error will be caught by the dialog and display the error message.
    throw new Error("Could not load game compatibility data.");
  }
}
