import loadMockApp from "../__mocks__/mockApp";
import { describe, test, beforeAll, expect } from "vitest";

describe("app", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadMockApp();
    });

    test("Should access the root route", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/",
        });

        expect(response.statusCode).toBe(200);
        expect(response.json().message).toBe("Welcome to FormulAPI!");
    });
});
