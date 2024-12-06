import { prisma } from "../../config.js";
import type { Constructor } from "./ConstructorSchema.js";

export async function getConstructorsFromDb(): Promise<Constructor[]> {
    const constructors = await prisma.constructor.findMany();

    const formatConstructors = constructors.map((constructor) => {
        return {
            id: constructor.id,
            name: constructor.name,
            fullName: constructor.full_name,
            countryId: constructor.country_id,
            bestStartingGridPosition: constructor.best_starting_grid_position,
            bestRaceResult: constructor.best_race_result,
            bestChampionshipPosition: constructor.best_championship_position,
            totalRaceEntries: constructor.total_race_entries,
            totalRaceStarts: constructor.total_race_starts,
            totalRaceLaps: constructor.total_race_laps,
            totalPodiums: constructor.total_podiums,
            totalPodiumRaces: constructor.total_podium_races,
            total1And2Finishes: constructor.total_1_and_2_finishes,
            totalPoints: constructor.total_points.toNumber(),
            totalChampionshipPoints: constructor.total_championship_points.toNumber(),
            totalChampionshipWins: constructor.total_championship_wins,
            totalPolePositions: constructor.total_pole_positions,
            totalFastestLaps: constructor.total_fastest_laps,
        };
    });

    return formatConstructors;
}