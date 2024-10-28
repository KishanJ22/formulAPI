import { describe, test, vi, expect } from "vitest";
import * as circuitRouter from "./circuits.router";
import request from 'supertest';
import express from 'express';

const app = express();
circuitRouter.circuitRouter(app);

describe("Circuit Router Tests", () => {
    test("Status of response when calling /circuits endpoint must be 200", async () => {
        await request(app)
            .get('/circuits')
            .expect(200);
    });

    test("Verify that the response is an array when calling /circuits endpoint", async () => {
        const response = await request(app)
            .get('/circuits');
        expect(response.body).toBeInstanceOf(Array);
    });

    test("Verify that the response is an object when calling /circuits/:id endpoint", async () => {
        const response = await request(app)
            .get('/circuits/monza');
        expect(response.body).toBeInstanceOf(Object);
    });

    test("Verify that an error is thrown when calling /circuits/:id endpoint with an invalid id", async () => {
        const response = await request(app)
            .get('/circuits/monz');
        expect(response.body).toEqual({ message: "No Circuit Found" });
    });

    test("Verify that an error is thrown when calling /circuits endpoint with an invalid query", async () => {
        const response = await request(app)
            .get('/circuits?invalidQuery=invalid');
        expect(response.body).toEqual({ message: "Invalid Search Query" });
    });
});