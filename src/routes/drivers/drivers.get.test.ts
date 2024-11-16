import getDrivers from "./drivers.get.js";
import mockApp from "../../__mocks__/mockApp.js";
import { vitest, describe, test, it, beforeAll, expect } from "vitest";

describe("GET /v1/drivers", () => {
    beforeAll(async () => {
        mockApp.register(getDrivers, { prefix: "/v1" });
        await mockApp.ready();
    });

    test("should return an array of drivers", async () => {
        const response = await mockApp.inject({
            method: "GET",
            url: "/v1/drivers",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toBeInstanceOf(Array);
    });
});