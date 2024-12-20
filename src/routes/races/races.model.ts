import { prisma } from "../../config";
import { type Static, Type } from "@sinclair/typebox";
import { Race } from "./racesSchema";
import { getGrandPrixFromDb } from "../grand-prix/grand-prix.model";
import { getDriversFromDb } from "../drivers/drivers.model";

const dbRace = Type.Object({
    year: Type.Number(),
    round: Type.Number(),
    race_date: Type.String(),
    grand_prix_id: Type.String(),
    official_name: Type.String(),
    circuit_type: Type.Union([
        Type.Literal("STREET"),
        Type.Literal("RACE"),
        Type.Literal("ROAD"),
    ]),
    laps: Type.Number(),
    pole_position_driver_id: Type.String(),
    pole_position_time: Type.String(),
    race_winner_driver_id: Type.String(),
    fastest_lap_time: Type.String(),
    fastest_lap_driver_id: Type.String(),
    driver_of_the_day_id: Type.String(),
});

type DbRace = Static<typeof dbRace>;

const formatRaces = async (races: DbRace[]): Promise<Race[]> => {
    const grandPrix = await getGrandPrixFromDb();
    const drivers = await getDriversFromDb();
    return races.map((race: DbRace) => {
        return {
            year: race.year,
            round: race.round,
            raceDate: race.race_date,
            officialName: race.official_name,
            grandPrixName:
                grandPrix.find((gp) => gp.id === race.grand_prix_id)?.fullName ||
                "",
            circuitType: race.circuit_type,
            laps: race.laps,
            polePositionDriver:
                drivers.find(
                    (driver) => driver.id === race.pole_position_driver_id,
                )?.name || "",
            polePositionTime: race.pole_position_time,
            raceWinnerDriver:
                drivers.find(
                    (driver) => driver.id === race.race_winner_driver_id,
                )?.name || "",
            fastestLapTime: race.fastest_lap_time,
            fastestLapDriver:
                drivers.find(
                    (driver) => driver.id === race.fastest_lap_driver_id,
                )?.name || "",
            driverOfTheDay:
                drivers.find(
                    (driver) => driver.id === race.driver_of_the_day_id,
                )?.name || "",
        };
    });
};

export const getRacesByYear = async (year: number): Promise<Race[]> => {
    const getRaces = await prisma.$queryRaw<DbRace[]>`
    SELECT
        r.year,
        r.round,
        r.date AS race_date,
        gp.id AS grand_prix_id,
        r.official_name AS official_name,
        r.circuit_type,
        r.laps,
        qr.driver_id AS pole_position_driver_id,
        qr.q3 AS pole_position_time,
        rr.driver_id AS race_winner_driver_id,
        fl.time AS fastest_lap_time,
        fl.driver_id AS fastest_lap_driver_id,
        dotd.driver_id AS driver_of_the_day_id
    FROM
        formulaone.race AS r
        JOIN formulaone.grand_prix AS gp ON r.grand_prix_id = gp.id
        LEFT JOIN formulaone.qualifying_result AS qr ON r.id = qr.race_id
        AND qr.position_number = 1
        LEFT JOIN formulaone.race_result AS rr ON r.id = rr.race_id
        AND rr.position_number = 1
        LEFT JOIN formulaone.driver_of_the_day_result AS dotd ON r.id = dotd.race_id
        AND dotd.position_number = 1
        LEFT JOIN formulaone.fastest_lap AS fl ON r.id = fl.race_id
        AND fl.position_number = 1
    WHERE
        r.year = ${year}
    ORDER BY
        r.round;
    `;

    return formatRaces(getRaces);
};

export const getRacesByRaceWinner = async (
    driverId: string,
): Promise<Race[]> => {
    const getRaces = await prisma.$queryRaw<DbRace[]>`
    SELECT
        r.year,
        r.round,
        r.date AS race_date,
        gp.id AS grand_prix_id,
        r.official_name AS official_name,
        r.circuit_type,
        r.laps,
        qr.driver_id AS pole_position_driver_id,
        qr.q3 AS pole_position_time,
        rr.driver_id AS race_winner_driver_id,
        fl.time AS fastest_lap_time,
        fl.driver_id AS fastest_lap_driver_id,
        dotd.driver_id AS driver_of_the_day_id
    FROM
        formulaone.race AS r
        JOIN formulaone.grand_prix AS gp ON r.grand_prix_id = gp.id
        LEFT JOIN formulaone.qualifying_result AS qr ON r.id = qr.race_id
        AND qr.position_number = 1
        LEFT JOIN formulaone.race_result AS rr ON r.id = rr.race_id
        AND rr.position_number = 1
        LEFT JOIN formulaone.driver_of_the_day_result AS dotd ON r.id = dotd.race_id
        AND dotd.position_number = 1
        LEFT JOIN formulaone.fastest_lap AS fl ON r.id = fl.race_id
        AND fl.position_number = 1
    WHERE
        rr.driver_id = ${driverId}
    ORDER BY
        race_date;
    `;

    return formatRaces(getRaces);
};

export const getRacesByYearAndRaceWinner = async (
    driverId: string,
    year: number,
): Promise<Race[]> => {
    const getRaces = await prisma.$queryRaw<DbRace[]>`
    SELECT
        r.year,
        r.round,
        r.date AS race_date,
        gp.id AS grand_prix_id,
        r.official_name AS official_name,
        r.circuit_type,
        r.laps,
        qr.driver_id AS pole_position_driver_id,
        qr.q3 AS pole_position_time,
        rr.driver_id AS race_winner_driver_id,
        fl.time AS fastest_lap_time,
        fl.driver_id AS fastest_lap_driver_id,
        dotd.driver_id AS driver_of_the_day_id
    FROM
        formulaone.race AS r
        JOIN formulaone.grand_prix AS gp ON r.grand_prix_id = gp.id
        LEFT JOIN formulaone.qualifying_result AS qr ON r.id = qr.race_id
        AND qr.position_number = 1
        LEFT JOIN formulaone.race_result AS rr ON r.id = rr.race_id
        AND rr.position_number = 1
        LEFT JOIN formulaone.driver_of_the_day_result AS dotd ON r.id = dotd.race_id
        AND dotd.position_number = 1
        LEFT JOIN formulaone.fastest_lap AS fl ON r.id = fl.race_id
        AND fl.position_number = 1
    WHERE
        r.year = ${year}
        AND rr.driver_id = ${driverId}
    ORDER BY
        race_date;
    `;

    return formatRaces(getRaces);
};

export const getRacesByGrandPrix = async (
    grandPrixId: string,
): Promise<Race[]> => {
    const getRaces = await prisma.$queryRaw<DbRace[]>`
    SELECT
        r.year,
        r.round,
        r.date AS race_date,
        gp.id AS grand_prix_id,
        r.official_name AS official_name,
        r.circuit_type,
        r.laps,
        qr.driver_id AS pole_position_driver_id,
        qr.q3 AS pole_position_time,
        rr.driver_id AS race_winner_driver_id,
        fl.time AS fastest_lap_time,
        fl.driver_id AS fastest_lap_driver_id,
        dotd.driver_id AS driver_of_the_day_id
    FROM
        formulaone.race AS r
        JOIN formulaone.grand_prix AS gp ON r.grand_prix_id = gp.id
        LEFT JOIN formulaone.qualifying_result AS qr ON r.id = qr.race_id
        AND qr.position_number = 1
        LEFT JOIN formulaone.race_result AS rr ON r.id = rr.race_id
        AND rr.position_number = 1
        LEFT JOIN formulaone.driver_of_the_day_result AS dotd ON r.id = dotd.race_id
        AND dotd.position_number = 1
        LEFT JOIN formulaone.fastest_lap AS fl ON r.id = fl.race_id
        AND fl.position_number = 1
    WHERE
        gp.id = ${grandPrixId}
    ORDER BY
        race_date;
    `;

    return formatRaces(getRaces);
};
