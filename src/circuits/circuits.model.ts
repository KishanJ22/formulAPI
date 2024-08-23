import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCircuitsFromDb = async (): Promise<any[]> => {
    const getCircuits = await prisma.circuit.findMany();
    const circuitsArray: any[] = [];
    getCircuits.forEach((circuit) => {
        circuitsArray.push(Object.values(circuit));
    });
    return circuitsArray;
};
