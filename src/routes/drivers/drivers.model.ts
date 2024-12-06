import { prisma } from "../../config.js";
import type { Driver } from "./DriverSchema.js";

export const getDriversFromDb = async (): Promise<Driver[]> => {
    const drivers = await prisma.driver.findMany();

    const formatDrivers: Driver[] = drivers.map((driver) => ({
        ...driver,
        date_of_birth: driver.date_of_birth.toISOString(),
        date_of_death: driver.date_of_death?.toISOString() ?? null,
        total_points: driver.total_points.toNumber(),
        total_championship_points: driver.total_championship_points.toNumber(),
    }));

    return formatDrivers;
};
