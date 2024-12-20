import { prisma } from "../../config.js";
import { type Static, Type } from "@sinclair/typebox";
import { getContinentsFromDb } from "./continents.model.js";

const country = Type.Object({
    id: Type.String(),
    code: Type.String(),
    name: Type.String(),
    demonym: Type.Union([Type.String(), Type.Null()]),
    continent: Type.String(),
});

export type Country = Static<typeof country>;

export const getCountriesAndContinentsFromDb = async (): Promise<Map<string, Country>> => {
    const getCountries = await prisma.country.findMany();
    const continents = await getContinentsFromDb();

    const countries = new Map<string, Country>(
        getCountries.map((country) => {
            return [
                country.id,
                {
                    id: country.id,
                    code: country.alpha3_code,
                    name: country.name,
                    demonym: country.demonym,
                    continent: continents.find((continent) => continent.id === country.continent_id)?.name || "",
                },
            ];
        })
    );

    return countries;
};
