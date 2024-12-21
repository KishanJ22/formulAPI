import loadMockApp from "../../__mocks__/mockApp.js";
import { describe, test, beforeAll, expect } from "vitest";

describe("GET /grand-prix", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
        app.listen();
    });

    test("should return an array of grand prix", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/grand-prix",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
    });

    test("should return an error if the query is invalid", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/grand-prix?invalid=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().message).toBe("Invalid Search Query");
    });

    test("should return an error if no grand prix are found", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/grand-prix?totalRacesHeld=0",
        });

        expect(response.statusCode).toBe(404);
        expect(response.json().message).toBe("No Grand Prix found");
    });

    test("should return an array of grand prix that match the query", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/grand-prix?totalRacesHeld=1",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
        expect(response.json().data.length).toBeGreaterThan(0);
    });
});