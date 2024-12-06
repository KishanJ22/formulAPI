import { prisma } from "../../config.js";
import type { Circuit } from "./CircuitSchema.js";

export const getCircuitsFromDb = async () => {
    const circuits = await prisma.circuit.findMany();

    const formattedCircuits: Circuit[] = circuits.map((circuit) => ({
        ...circuit,
        latitude: circuit.latitude.toNumber(),
        longitude: circuit.longitude.toNumber(),
    }));

    return formattedCircuits;
};