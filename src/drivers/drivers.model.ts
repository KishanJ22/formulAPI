import prisma from "../db";

export const getDriversFromDb = async (): Promise<any[]> => {
    const getDrivers = await prisma.driver.findMany();
    const driversArray: any[] = [];
    getDrivers.forEach((driver) => {
        driversArray.push(Object.values(driver));
    });
    return driversArray;
};
