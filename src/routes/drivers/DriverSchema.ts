import { type Static, Type } from "@sinclair/typebox";

export const driver = Type.Object({
    id: Type.String(),
    name: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
    abbreviation: Type.String(),
    permanent_number: Type.Union([Type.String(), Type.Null()]),
    gender: Type.String(),
    date_of_birth: Type.String({ format: "date-time" }), // Dates are strings in the database
    date_of_death: Type.Union([Type.String({ format: "date-time"}), Type.Null()]),
    place_of_birth: Type.String(),
    country_of_birth_country_id: Type.String(),
    nationality_country_id: Type.String(),
    second_nationality_country_id: Type.Union([Type.String(), Type.Null()]),
    best_championship_position: Type.Union([Type.Number(), Type.Null()]),
    best_starting_grid_position: Type.Union([Type.Number(), Type.Null()]),
    best_race_result: Type.Union([Type.Number(), Type.Null()]),
    total_championship_wins: Type.Number(),
    total_race_entries: Type.Number(),
    total_race_starts: Type.Number(),
    total_race_wins: Type.Number(),
    total_race_laps: Type.Number(),
    total_podiums: Type.Number(),
    total_points: Type.Number(),
    total_championship_points: Type.Number(),
    total_pole_positions: Type.Number(),
    total_fastest_laps: Type.Number(),
    total_driver_of_the_day: Type.Number(),
    total_grand_slams: Type.Number(),
});

export type Driver = Static<typeof driver>;
