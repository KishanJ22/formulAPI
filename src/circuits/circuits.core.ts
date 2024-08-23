import { Decimal } from "@prisma/client/runtime/library";
import { getCircuitsFromDb } from "./circuits.model";

export interface Circuit {
    id: string;
    name: string;
    fullName: string;
    previousNames?: string;
    type: string;
    placeName: string;
    countryId: string;
    latitude: Decimal;
    longitude: Decimal;
    racesHeld: number;
    [key: string]: any;
};

export const getAllCircuits = async (searchQuery?: any): Promise<Circuit[]> => {
    const getCircuits = await getCircuitsFromDb();
    const allCircuits: Circuit[] = getCircuits.map((circuit) => {
        return {
            id: circuit[0],
            name: circuit[1],
            fullName: circuit[2],
            previousNames: circuit[3],
            type: circuit[4],
            placeName: circuit[5],
            countryId: circuit[6],
            latitude: circuit[7],
            longitude: circuit[8],
            racesHeld: circuit[9]
        };
    });

    if(searchQuery) {
        if(!await validateKeys(searchQuery)) throw new Error("Invalid Search Query");
        let filteredCircuits: Circuit[];
        filteredCircuits = allCircuits.filter((circuit) => {
            return Object.keys(searchQuery).every((key) => {
                if(key === "racesHeld") {
                return circuit[key] === searchQuery[key];
                } else {
                    return circuit[key].toLowerCase() === searchQuery[key].toLowerCase();
                };
            });
        });
        if(filteredCircuits.length == 0) throw new Error("No Circuits Found"); 
        else return filteredCircuits;
    } else {
        return allCircuits;
    }
};

export const getOneCircuit = async (circuitId: string): Promise<Circuit> => {
    const circuits: Circuit[] = await getAllCircuits();
    const circuit = circuits.find((circuit) => circuit.id === circuitId);
    if(circuit) {
        return circuit;
    }
    else throw new Error("No Circuit Found");
};

const validateKeys = async (searchQuery: any): Promise<boolean> => {
    const circuits: Circuit[] = await getAllCircuits();
    const searchKeys = Object.keys(searchQuery);
    const validKeys = Object.keys(circuits[0]);
    return searchKeys.every((key) => validKeys.includes(key));
};