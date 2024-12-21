import { type Static, Type } from "@sinclair/typebox";
import { prisma } from "../../config.js";

const continent = Type.Object({
    id: Type.String(),
    code: Type.String(),
    name: Type.String(),
    demonym: Type.String(),
});

type Continent = Static<typeof continent>;

export const getContinentsFromDb = async (): Promise<Continent[]> => {
    return await prisma.continent.findMany();
};
