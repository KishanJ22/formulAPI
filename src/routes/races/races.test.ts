import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, test, beforeAll, expect } from "vitest";

describe("GET /races", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
        app.listen();
    });

    test("should return an array of races when a year is provided", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/races?year=2021",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
    });

    test("should return an error if no query is provided", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/races",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().message).toBe("Invalid Search Query");
    });

    test("should return an error if the query is invalid", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/races?invalid=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().message).toBe("Invalid Search Query");
    });

    test("should return an error if no races are found", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/races?year=2010&raceWinnerId=max-verstappen",
        });

        expect(response.statusCode).toBe(404);
        expect(response.json().message).toBe("Unable to find races");
    });
});