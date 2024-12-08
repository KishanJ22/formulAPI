import loadMockApp from "../__mocks__/mockApp";
import { describe, test, beforeAll, expect } from "vitest";

describe("app", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    test("Should access the health route", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/health",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().message).toBe("API is healthy");
    });
});
