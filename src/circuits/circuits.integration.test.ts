import { describe, expect, it } from "vitest";
import axios, { AxiosResponse, AxiosError } from "axios";
import prisma from "../db";
import { appUrl } from "../config";

const circuitsAxios = axios.create({
  baseURL: `${appUrl}`
});

describe.todo("Circuit Integration Tests", () => {

    describe("GET /circuits", () => {
        it("should return all circuits", async () => {
            const response: AxiosResponse = await circuitsAxios.get("/circuits");
            expect(response.status).toBe(200);
            expect(response.data).toBeInstanceOf(Array);
        });
    });
});