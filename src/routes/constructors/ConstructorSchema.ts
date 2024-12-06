import { type Static, Type } from "@sinclair/typebox";

export const constructor = Type.Object({
    id: Type.String(),
    name: Type.String(),
    fullName: Type.String(),
    countryId: Type.String(),
    bestChampionshipPosition: Type.Union([Type.Number(), Type.Null()]),
    bestStartingGridPosition: Type.Union([Type.Number(), Type.Null()]),
    bestRaceResult: Type.Union([Type.Number(), Type.Null()]),
    totalChampionshipWins: Type.Number(),
    totalRaceEntries: Type.Number(),
    totalRaceStarts: Type.Number(),
    total1And2Finishes: Type.Number(),
    totalRaceLaps: Type.Number(),
    totalPodiums: Type.Number(),
    totalPodiumRaces: Type.Number(),
    totalPoints: Type.Number(),
    totalChampionshipPoints: Type.Number(),
    totalPolePositions: Type.Number(),
    totalFastestLaps: Type.Number(),
});

export type Constructor = Static<typeof constructor>;