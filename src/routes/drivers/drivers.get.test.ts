import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, test, beforeAll, expect } from "vitest";

describe("GET /drivers", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
        app.listen();
    });

    test("should return an array of drivers", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/drivers",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
    });

    test("should return an error if the query is invalid", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/drivers?invalid=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().message).toBe("Invalid Search Query");
    });

    test("should return an error if no drivers are found", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/drivers?first_name=invalid",
        });

        expect(response.statusCode).toBe(404);
        expect(response.json().message).toBe("No Drivers Found");
    });

    test("should return an array of drivers that match the query", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/drivers?total_championship_wins=7",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
        expect(response.json().data.length).toBeGreaterThan(0);
    });

    test("should return an array of drivers that match the query", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/drivers?total_points=1",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
        expect(response.json().data.length).toBeGreaterThan(0);
    });
});
