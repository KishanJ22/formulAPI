import { type Static, Type } from "@sinclair/typebox";

export const getRacesQuery = Type.Object({
    season: Type.Number(),
});

export type GetRacesQuery = Static<typeof getRacesQuery>;

export const race = Type.Object({
    round: Type.Number(),
    raceDate: Type.String({ format: "date" }),
    officialName: Type.String(),
    grandPrixName: Type.String(),
    circuitType: Type.Union([
        Type.Literal("STREET"),
        Type.Literal("RACE"),
        Type.Literal("ROAD"),
    ]),
    laps: Type.Number(),
    polePositionDriver: Type.String(),
    polePositionTime: Type.String(),
    raceWinnerDriver: Type.String(),
    fastestLapTime: Type.String(),
    fastestLapDriver: Type.String(),
    driverOfTheDay: Type.String(),
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