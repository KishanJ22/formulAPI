import { getDriversFromDb } from "./drivers.model";
export interface Driver {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    fullName: string;
    abbreviation: string;
    permanentNumber?: string|null;
    gender: string;
    dateOfBirth: string;
    dateOfDeath?: string|null;
    placeOfBirth: string;
    countryOfBirthId: string;
    nationalityCountryId: string;
    secondNationalityCountryId?: string|null;
    bestChampionshipPosition: number|null;
    bestStartingGridPosition: number|null;
    bestRaceResult: number|null;
    championshipWins: number;
    raceEntries: number;
    raceStarts: number;
    raceWins: number;
    raceLaps: number;
    podiums: number;
    totalPoints: string;
    totalChampionshipPoints: string;
    polePositions: number;
    fastestLaps: number;
    totalDriverOfTheDay: number;
    grandSlams: number;
    [key: string]: any; // Add index signature
}

// Takes an optional search query with the type of object of strings and returns an array of drivers
export const getAllDrivers = async (searchQuery?: any): Promise<Driver[]> => {
    const getDrivers = await getDriversFromDb();
    const allDrivers: Driver[] = getDrivers.map((driver) => {
        return {
            id: driver[0],
            name: driver[1],
            firstName: driver[2],
            lastName: driver[3],
            fullName: driver[4],
            abbreviation: driver[5],
            permanentNumber: driver[6],
            gender: driver[7],
            dateOfBirth: driver[8],
            dateOfDeath: driver[9],
            placeOfBirth: driver[10],
            countryOfBirthId: driver[11],
            nationalityCountryId: driver[12],
            secondNationalityCountryId: driver[13],
            bestChampionshipPosition: driver[14],
            bestStartingGridPosition: driver[15],
            bestRaceResult: driver[16],
            championshipWins: driver[17],
            raceEntries: driver[18],
            raceStarts: driver[19],
            raceWins: driver[20],
            raceLaps: driver[21],
            podiums: driver[22],
            totalPoints: driver[23],
            totalChampionshipPoints: driver[24],
            polePositions: driver[25],
            fastestLaps: driver[26],
            totalDriverOfTheDay: driver[27],
            grandSlams: driver[28],
        };
    });

    if(searchQuery) {
        if(!await validateKeys(searchQuery)) throw new Error("Invalid Search Query");
        let filteredDrivers: Driver[];
        filteredDrivers = allDrivers.filter((driver: Driver) => {
            return Object.keys(searchQuery).every((key) => {
                if (key === "raceEntries" || key === "raceStarts" || key === "raceWins" || key === "raceLaps" || key === "podiums" || key === "championshipWins" || key === "bestChampionshipPosition" || key === "bestStartingGridPosition" || key === "bestRaceResult" || key === "polePositions" || key === "fastestLaps" || key === "totalDriverOfTheDay" || key === "grandSlams") {
                    return driver[key] == searchQuery[key];
                } else {
                    return driver[key].toLowerCase().includes(searchQuery[key].toLowerCase());
                };
            });
        });
        if(filteredDrivers.length === 0) throw new Error("No Drivers Found");
        return filteredDrivers;
    } else {
        return allDrivers;
    }
};

const validateKeys = async (searchQuery: any): Promise<boolean> => {
    const drivers: Driver[] = await getAllDrivers();
    const searchKeys = Object.keys(searchQuery);
    const validKeys = Object.keys(drivers[0]);
    return searchKeys.every((key) => validKeys.includes(key));
};

export const getOneDriver = async (driverId: string): Promise<Driver> => {
    const drivers: Driver[] = await getAllDrivers();
    const driver: Driver = drivers.find((driver) => driver.id === driverId)!;
    if (driver) {
        return driver;
    }
    else throw new Error("No Driver Found");
};
