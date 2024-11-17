import express from "express";
import { describe, test, expect } from "vitest";
import { driverRouter } from "./drivers.router";
const request = require("supertest");

const app = express();
driverRouter(app);

describe("Driver Router Tests", () => {
    test("Status of response when calling /drivers endpoint must be 200", async () => {
        await request(app).get("/drivers").expect(200);
    });

    test("Verify that the response is an array when calling /drivers endpoint", async () => {
        const response = await request(app).get("/drivers");
        expect(response.body).toBeInstanceOf(Array);
    });

    test("Verify that the response is an object when calling /drivers/:id endpoint", async () => {
        const response = await request(app).get("/drivers/lewis-hamilton");
        expect(response.body).toBeInstanceOf(Object);
    });

    test("Verify that an error is thrown when calling /drivers/:id endpoint with an invalid id", async () => {
        const response = await request(app).get("/drivers/kimi-antontelli");
        expect(response.body).toEqual({ message: "No Driver Found" });
    });

    test("Verify that an error is thrown when calling /drivers endpoint with an invalid query", async () => {
        const response = await request(app).get(
            "/drivers?invalidQuery=invalid",
        );
        expect(response.body).toEqual({ message: "Invalid Search Query" });
    });
});
