import {Circuit, getAllCircuits, getOneCircuit} from "./circuits.core";
import { describe, expect, test, vi } from 'vitest';
import { circuitRouter } from "./circuits.router";
import * as circuitsModel from "./circuits.model";
import axios, { AxiosResponse } from "axios";

const mockedCircuits = vi.spyOn(circuitsModel, "getCircuitsFromDb");

describe ("Circuit Tests", () => {
    test("Get all circuits", async () => {
        mockedCircuits.mockResolvedValueOnce([
          ["albert_park", "Albert Park", "Albert Park Grand Prix Circuit", "Melbourne Grand Prix Circuit", "Australia"],
        ]);
    });
});