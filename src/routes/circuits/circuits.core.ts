import { Decimal } from "@prisma/client/runtime/library";
import { getCircuitsFromDb } from "./circuits.model";

export interface Circuit {
    id: string;
    name: string;
    full_name: string;
    previous_names?: string;
    type: string;
    place_name: string;
    country_id: string;
    latitude: Decimal;
    longitude: Decimal;
    total_races_held: number;
    [key: string]: any;
};

export const getAllCircuits = async (searchQuery?: any): Promise<Circuit[]> => {
    const getCircuits = await getCircuitsFromDb();
    const allCircuits: Circuit[] = getCircuits.map((circuit) => {
        return {
            id: circuit[0],
            name: circuit[1],
            full_name: circuit[2],
            previous_names: circuit[3],
            type: circuit[4],
            place_name: circuit[5],
            country_id: circuit[6],
            latitude: circuit[7],
            longitude: circuit[8],
            total_races_held: circuit[9]
        };
    });

    if(searchQuery) {
        if(!await validateKeys(searchQuery)) throw new Error("Invalid Search Query");
        const filteredCircuits: Circuit[] = allCircuits.filter((circuit) => {
            return Object.keys(searchQuery).every((key) => {
                if(key === "total_races_held") {
                return circuit[key] === searchQuery[key];
                } else {
                    return circuit[key].toLowerCase() === searchQuery[key].toLowerCase();
                };
            });
        });
        if (filteredCircuits.length == 0) throw new Error("No Circuits Found"); 
        else return filteredCircuits;
    } else {
        return allCircuits;
    }
};

export const getOneCircuit = async (circuitId: string): Promise<Circuit> => {
    const circuits: Circuit[] = await getAllCircuits();
    const circuit = circuits.find((circuit) => circuit.id === circuitId);
    if(circuit) return circuit;
    else throw new Error("No Circuit Found");
};

const validateKeys = async (searchQuery: any): Promise<boolean> => {
    const circuits: Circuit[] = await getAllCircuits();
    const searchKeys = Object.keys(searchQuery);
    const validKeys = Object.keys(circuits[0]);
    return searchKeys.every((key) => validKeys.includes(key));
};