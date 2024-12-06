import { type Static, Type } from "@sinclair/typebox";

export const circuit = Type.Object({
    id: Type.String(),
    name: Type.String(),
    full_name: Type.String(),
    previous_names: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    type: Type.String(),
    place_name: Type.String(),
    country_id: Type.String(),
    latitude: Type.Number(),
    longitude: Type.Number(),
    total_races_held: Type.Number(),
});

export type Circuit = Static<typeof circuit>;