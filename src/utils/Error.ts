import { type Static, Type } from "@sinclair/typebox";

export const invalidQuery = Type.Object({
    message: Type.Literal("Invalid Search Query"),
});

export const internalServerError = Type.Object({ 
    message: Type.Literal("Internal Server Error"),
});

export type InvalidQuerySchema = Static<typeof invalidQuery>;
export type InternalServerErrorSchema = Static<typeof internalServerError>;