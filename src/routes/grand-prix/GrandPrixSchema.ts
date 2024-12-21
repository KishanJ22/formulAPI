import { type Static, Type } from "@sinclair/typebox";

export const grandPrix = Type.Object({
    id: Type.String(),
    name: Type.String(),
    fullName: Type.String(),
    shortName: Type.String(),
    abbreviation: Type.String(),
    countryName: Type.Union([Type.String(), Type.Null()]),
    countryCode: Type.Union([Type.String(), Type.Null()]),
    totalRacesHeld: Type.Number(),
});

export type GrandPrix = Static<typeof grandPrix>;

export const grandPrixNotFound = Type.Object({
    message: Type.Literal("No Grand Prix found"),
});

export type GrandPrixNotFound = Static<typeof grandPrixNotFound>;