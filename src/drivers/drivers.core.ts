import { getDriversFromDb } from "./drivers.model";
export interface Driver {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    full_name: string;
    abbreviation: string;
    permanent_number?: string|null;
    gender: string;
    date_of_birth: string;
    date_of_death?: string|null;
    place_of_birth: string;
    country_of_birth_country_id: string;
    nationality_country_id: string;
    second_nationality_country_id?: string|null;
    best_championship_position: number|null;
    best_starting_grid_position: number|null;
    best_race_result: number|null;
    total_championship_wins: number;
    total_race_entries: number;
    total_race_starts: number;
    total_race_wins: number;
    total_race_laps: number;
    total_podiums: number;
    total_points: number;
    total_championship_points: number;
    total_pole_positions: number;
    total_fastest_laps: number;
    total_driver_of_the_day: number;
    total_grand_slams: number;
    [key: string]: any; // Add index signature
}

// Takes an optional search query with the type of object of strings and returns an array of drivers
export const getAllDrivers = async (searchQuery?: any): Promise<Driver[]> => {
    const getDrivers = await getDriversFromDb();
    const allDrivers: Driver[] = getDrivers.map((driver) => {
        return {
            id: driver[0],
            name: driver[1],
            first_name: driver[2],
            last_name: driver[3],
            full_name: driver[4],
            abbreviation: driver[5],
            permanent_number: driver[6],
            gender: driver[7],
            date_of_birth: driver[8],
            date_of_death: driver[9],
            place_of_birth: driver[10],
            country_of_birth_country_id: driver[11],
            nationality_country_id: driver[12],
            second_nationality_country_id: driver[13],
            best_championship_position: driver[14],
            best_starting_grid_position: driver[15],
            best_race_result: driver[16],
            total_championship_wins: driver[17],
            total_race_entries: driver[18],
            total_race_starts: driver[19],
            total_race_wins: driver[20],
            total_race_laps: driver[21],
            total_podiums: driver[22],
            total_points: driver[23],
            total_championship_points: driver[24],
            total_pole_positions: driver[25],
            total_fastest_laps: driver[26],
            total_driver_of_the_day: driver[27],
            total_grand_slams: driver[28],
        };
    });

    if(searchQuery) {
        if(!await validateKeys(searchQuery)) throw new Error("Invalid Search Query");
        let filteredDrivers: Driver[];
        filteredDrivers = allDrivers.filter((driver: Driver) => {
            return Object.keys(searchQuery).every((key) => {
                if (key === "total_race_entries" || key === "total_race_starts" || key === "total_race_wins" || key === "total_race_laps" || key === "total_podiums" || key === "total_championship_wins" || key === "best_championship_position" || key === "best_starting_grid_position" || key === "best_race_result" || key === "total_pole_positions" || key === "total_fastest_laps" || key === "total_driver_of_the_day" || key === "total_grand_slams") {
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
