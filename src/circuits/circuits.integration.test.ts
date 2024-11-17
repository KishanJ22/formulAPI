import {
    afterEach,
    afterAll,
    describe,
    expect,
    it,
    vi,
    beforeAll,
} from "vitest";
import axios, { AxiosResponse } from "axios";
import { closemockApp, createmockApp } from "../__mocks__/express";
import { BASE_URL } from "../config";

describe("Circuit Integration Tests", () => {
    let circuitsAxios: any;

    beforeAll(async () => {
        const port = 3002;
        await createmockApp(port);

        circuitsAxios = axios.create({
            baseURL: `${BASE_URL}:${port}`,
        });
    });

    afterEach(async () => {
        vi.clearAllMocks();
    });

    afterAll(async () => {
        await closemockApp();
    });

    describe("GET /circuits", () => {
        it("should return all circuits", async () => {
            const response: AxiosResponse =
                await circuitsAxios.get("/circuits");
            expect(response.status).toBe(200);
            expect(response.data).toBeInstanceOf(Array);
        });
    });
});
