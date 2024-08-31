import prisma from "../db";

export const getCircuitsFromDb = async (): Promise<any[]> => {
    const getCircuits = await prisma.circuit.findMany();
    const circuitsArray: any[] = [];
    getCircuits.forEach((circuit) => {
        circuitsArray.push(Object.values(circuit));
    });
    return circuitsArray;
};
