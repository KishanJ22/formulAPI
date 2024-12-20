import { prisma } from "../../config.js";
import { type Static, Type } from "@sinclair/typebox";
import type { GrandPrix } from "./GrandPrixSchema.js";
import { getCountriesAndContinentsFromDb } from "../countries-and-continents/countries.model.js";

const grandPrixDb = Type.Object({
    id: Type.String(),
    name: Type.String(),
    full_name: Type.String(),
    short_name: Type.String(),
    abbreviation: Type.String(),
    country_id: Type.Union([Type.String(), Type.Null()]),
    total_races_held: Type.Number(),
});

type GrandPrixDb = Static<typeof grandPrixDb>;

export const getGrandPrixFromDb = async (): Promise<GrandPrix[]> => {
    return formatGrandPrix(await prisma.grand_prix.findMany());
};

const formatGrandPrix = async (
    grandPrix: GrandPrixDb[],
): Promise<GrandPrix[]> => {
    const countries = await getCountriesAndContinentsFromDb();
    return grandPrix.map((gp: GrandPrixDb) => {
        return {
            id: gp.id,
            name: gp.name,
            fullName: gp.full_name,
            shortName: gp.short_name,
            abbreviation: gp.abbreviation,
            countryName:
                (gp.country_id && countries.get(gp.country_id)?.name) || null,
            countryCode:
                (gp.country_id && countries.get(gp.country_id)?.code) || null,
            totalRacesHeld: gp.total_races_held,
        };
    });
};
