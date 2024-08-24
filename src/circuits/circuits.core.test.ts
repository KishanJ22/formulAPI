import {getAllCircuits, getOneCircuit} from "./circuits.core";
import { describe, expect, test, vi } from 'vitest';
import * as circuitsModel from "./circuits.model";

const mockedCircuits = vi.spyOn(circuitsModel, "getCircuitsFromDb");
describe ("/circuits GET Unit Tests", async () => {

    test("Get all circuits", async () => {
      mockedCircuits.mockResolvedValueOnce([
        ["adelaide", "Adelaide", "Adelaide Street Circuit", null, "STREET", "Adelaide", "australia", "-34.927222", "138.617222", 11],
        ["aida", "Aida", "Okayama International Circuit", "TI Circuit Aida", "RACE", "Aida", "japan", "34.915", "134.221111", 2],
        ["ain-diab", "Ain-Diab", "Ain-Diab Circuit", null, "ROAD", "Casablanca", "morocco", "33.578611", "-7.6875", 1]
      ]);
      const circuits = await getAllCircuits();
      const expectedCircuits = [
        { id: "adelaide", name: "Adelaide", fullName: "Adelaide Street Circuit", previousNames: null, type: "STREET", placeName: "Adelaide", countryId: "australia", latitude: "-34.927222", longitude: "138.617222", racesHeld: 11 },
        { id: "aida", name: "Aida", fullName: "Okayama International Circuit", previousNames: "TI Circuit Aida", type: "RACE", placeName: "Aida", countryId: "japan", latitude: "34.915", longitude: "134.221111", racesHeld: 2 },
        { id: "ain-diab", name: "Ain-Diab", fullName: "Ain-Diab Circuit", previousNames: null, type: "ROAD", placeName: "Casablanca", countryId: "morocco", latitude: "33.578611", longitude: "-7.6875", racesHeld: 1 }
      ];
      expect(circuits).toEqual(expect.arrayContaining(expectedCircuits));
    });

    test("Get one circuit", async () => {
      mockedCircuits.mockResolvedValueOnce([
        ["adelaide", "Adelaide", "Adelaide Street Circuit", null, "STREET", "Adelaide", "australia", "-34.927222", "138.617222", 11]
      ]);
      const circuit = await getOneCircuit("adelaide");
      const expectedCircuit = { id: "adelaide", name: "Adelaide", fullName: "Adelaide Street Circuit", previousNames: null, type: "STREET", placeName: "Adelaide", countryId: "australia", latitude: "-34.927222", longitude: "138.617222", racesHeld: 11 };
      expect(circuit).toEqual(expectedCircuit);
    });

    test("Error is thrown when circuit is not found", async () => {
      await expect(getOneCircuit("willow-springs")).rejects.toThrow("No Circuit Found");
    });

    test("Get all circuits with search query", async () => {
      mockedCircuits.mockResolvedValueOnce([
        ["adelaide", "Adelaide", "Adelaide Street Circuit", null, "STREET", "Adelaide", "australia", "-34.927222", "138.617222", 11]
      ]);
      const circuit = await getAllCircuits({fullName: "Adelaide Street Circuit"});
      const expectedCircuit = { id: "adelaide", name: "Adelaide", fullName: "Adelaide Street Circuit", previousNames: null, type: "STREET", placeName: "Adelaide", countryId: "australia", latitude: "-34.927222", longitude: "138.617222", racesHeld: 11 };
      expect(circuit).toEqual(expect.arrayContaining([expectedCircuit]));
    });
});