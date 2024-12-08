import loadApp from "./app";
import { describe, test, beforeAll, expect } from "vitest";

describe("app", () => {
    let app: any;

    beforeAll(async () => {
        app = await loadApp();
    });

    test("app is defined", () => {
        expect(app).toBeDefined();
    });

    test("app has a config object", () => {
        expect(app.config).toBeDefined();
    });
});
