import {getAllCircuits, getOneCircuit} from "./circuits.core";
import { describe, expect, test, vi } from 'vitest';
import prisma from "../__mocks__/prisma";
import { Decimal } from "@prisma/client/runtime/library";

vi.mock('../db');
describe ("Circuits Unit Tests", async () => {
  describe("getAllCircuits", async () => {
    test("Successfully returns all circuits in the correct format", async () => {
      const expectedCircuits = [
        {
          id: "adelaide",
          name: "Adelaide",
          full_name: "Adelaide Street Circuit",
          previous_names: null,
          type: "STREET",
          place_name: "Adelaide",
          country_id: "australia",
          latitude: new Decimal(-34.927222),
          longitude: new Decimal(138.617222),
          total_races_held: 11
        },
        {
          id: "aida",
          name: "Aida",
          full_name: "Okayama International Circuit",
          previous_names: "TI Circuit Aida",
          type: "RACE",
          place_name: "Aida",
          country_id: "japan",
          latitude: new Decimal(34.915),
          longitude: new Decimal(134.221111),
          total_races_held: 2
        },
      ];
      prisma.circuit.findMany.mockResolvedValue(expectedCircuits);
      const circuits = await getAllCircuits();
      expect(circuits).toEqual(expect.arrayContaining(expectedCircuits));
    });

    test("Successfully returns expected circuits after using a search query", async () => {
      const expectedCircuits = [
        {
          id: "adelaide",
          name: "Adelaide",
          full_name: "Adelaide Street Circuit",
          previous_names: null,
          type: "STREET",
          place_name: "Adelaide",
          country_id: "australia",
          latitude: new Decimal(-34.927222),
          longitude: new Decimal(138.617222),
          total_races_held: 11
        }
      ];
      prisma.circuit.findMany.mockResolvedValue(expectedCircuits);
      const full_name = "Adelaide Street Circuit";
      const circuit = await getAllCircuits({ full_name });
      expect(circuit).toEqual(expect.arrayContaining(expectedCircuits));
    });

    test("Successfully throws `No Circuits Found` error when an invalid search query is used", async () => {
      await expect(getAllCircuits({ full_name: "Willow Springs" })).rejects.toThrow("No Circuits Found");
    });

    test("Successfully throws `Invalid Search Query` error when an invalid search query is used", async () => {
      await expect(getAllCircuits({ invalid_key: "Adelaide Street Circuit" })).rejects.toThrow("Invalid Search Query");
    });
  });

  describe("getOneCircuit", async () => {
    test("Successfully returns the expected circuit when provided an id", async () => {
      const expectedCircuit =
      {
        id: "adelaide",
        name: "Adelaide",
        full_name: "Adelaide Street Circuit",
        previous_names: null,
        type: "STREET",
        place_name: "Adelaide",
        country_id: "australia",
        latitude: new Decimal(-34.927222),
        longitude: new Decimal(138.617222),
        total_races_held: 11
      };
      prisma.circuit.findUnique.mockResolvedValue(expectedCircuit);
      const circuit = await getOneCircuit("adelaide");
      expect(circuit).toEqual(expectedCircuit);
    });

    test("Successfully throws `No Circuit Found` error when an invalid circuit id is used", async () => {
      await expect(getOneCircuit("willow-springs")).rejects.toThrow("No Circuit Found");
    });
  });
});