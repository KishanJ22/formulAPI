import loadMockApp from "../__mocks__/mockApp.js";
import { describe, test, beforeAll, expect, vi } from "vitest";
import { prisma } from "../config.js";

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

    test("Should return an unhealthy status", async () => {
        prisma.driver.findFirst = vi.fn().mockResolvedValue(null);

        const response = await app.inject({
            method: "GET",
            url: "/health",
        });

        expect(response.statusCode).toBe(500);
        expect(response.json().message).toBe("API is unhealthy");
    });
});
