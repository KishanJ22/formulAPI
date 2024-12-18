import { prisma } from "../../config";
import { type Static, Type } from "@sinclair/typebox";
import { Race } from "./racesSchema";

const dbRace = Type.Object({
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
    fastest_lap: Type.String(),
    fastest_lap_driver_id: Type.String(),
    driver_of_the_day_id: Type.String(),
});

type DbRace = Static<typeof dbRace>;

const formatRaces = (races: DbRace[]): Race[] => {
    return races.map((race: DbRace) => {
        return {
            round: race.round,
            raceDate: race.race_date,
            grandPrixId: race.grand_prix_id,
            officialName: race.official_name,
            circuitType: race.circuit_type,
            laps: race.laps,
            polePositionDriverId: race.pole_position_driver_id,
            polePositionTime: race.pole_position_time,
            raceWinnerDriverId: race.race_winner_driver_id,
            fastestLapTime: race.fastest_lap_driver_id,
            fastestLapDriverId: race.fastest_lap_driver_id,
            driverOfTheDayId: race.driver_of_the_day_id,
        };
    });
};

export const getRacesForSeason = async (season: number): Promise<Race[]> => {
    const getRaces = prisma.$queryRaw<DbRace[]>`
    SELECT
        r.round,
        r.date AS race_date,
        gp.id AS grand_prix_id,
        r.official_name AS official_name,
        r.circuit_type,
        r.laps,
        qr.driver_id AS pole_position_driver_id,
        qr.q3 AS pole_position_time,
        rr.driver_id AS race_winner_driver_id,
        fl.time AS fastest_lap,
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
        r.year = ${season}
    ORDER BY
        r.round;
    `;

    return formatRaces(await getRaces);
};
