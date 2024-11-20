import loadMockApp from "../../__mocks__/mockApp";
import { describe, test, beforeAll, expect } from "vitest";

describe("GET /circuits", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
        app.listen();
    });

    test("should return an array of circuits", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/circuits",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
    });

    test("should return an error if the query is invalid", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/circuits?invalid=invalid",
        });

        expect(response.statusCode).toBe(400);
        expect(response.json().message).toBe("Invalid Search Query");
    });

    test("should return an error if no circuits are found", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/circuits?name=invalid",
        });

        expect(response.statusCode).toBe(404);
        expect(response.json().message).toBe("No Circuits Found");
    });

    test("should return an array of circuits that match the query", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/circuits?country_id=italy",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().data).toBeInstanceOf(Array);
        expect(response.json().data.length).toBeGreaterThan(0);
    });
});
