import { type Static, Type } from "@sinclair/typebox";

export const getRacesQuery = Type.Object({
    season: Type.Number(),
});

export type GetRacesQuery = Static<typeof getRacesQuery>;

export const race = Type.Object({
    round: Type.Number(),
    raceDate: Type.String({ format: "date" }),
    grandPrixId: Type.String(),
    officialName: Type.String(),
    circuitType: Type.Union([
        Type.Literal("STREET"),
        Type.Literal("RACE"),
        Type.Literal("ROAD"),
    ]),
    laps: Type.Number(),
    polePositionDriverId: Type.String(),
    polePositionTime: Type.String(),
    raceWinnerDriverId: Type.String(),
    fastestLapTime: Type.String(),
    fastestLapDriverId: Type.String(),
    driverOfTheDayId: Type.String(),
});

export type Race = Static<typeof race>;

export const racesNotFound = Type.Object({
    message: Type.Literal("Unable to find races"),
});

export type RacesNotFound = Static<typeof racesNotFound>;

export const seasonNotProvided = Type.Object({
    message: Type.Literal("Season not provided in search query"),
});

export type SeasonNotProvided = Static<typeof seasonNotProvided>;