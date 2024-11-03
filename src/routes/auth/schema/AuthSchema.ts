import { type Static, Type } from "@sinclair/typebox";

export const registrationBody = Type.Object({
    username: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
});

export const successfulRegistration = Type.Object({
    message: Type.Literal("User created successfully"),
    username: Type.String(),
    api_key: Type.String(),
});

export const usernameExists = Type.Object({
    message: Type.Literal("Username already exists"),
});

export const missingFields = Type.Object({
    message: Type.Literal("Missing required fields"),
});

export const errorCreatingUser = Type.Object({
    message: Type.Literal("Error creating user"),
});

export const getTokenBody = Type.Object({
    username: Type.String(),
    key: Type.String(),
});

export const getTokenResponse = Type.Object({
    token: Type.String(),
    tokenType: Type.String(),
    expiresIn: Type.String(),
});

export const errorVerifyingToken = Type.Object({
    message: Type.Literal("Error verifying token"),
});

export const invalidCredentials = Type.Object({
    message: Type.Literal("Invalid credentials"),
});

export const invalidKey = Type.Object({
    message: Type.Literal("Invalid key"),
});

export const userNotFound = Type.Object({
    message: Type.Literal("User not found"),
});

export const invalidToken = Type.Object({
    message: Type.Literal("Invalid token"),
});

export const validToken = Type.Object({
    message: Type.Literal("Token is valid"),
    userDetails: Type.Object({
        username: Type.String(),
        firstname: Type.String(),
        lastname: Type.String(),
        role: Type.String(),
        expiresAt: Type.Optional(Type.Union([Type.String(), Type.Number()])),
    }),
});

export type RegistrationBodySchema = Static<typeof registrationBody>;
export type SuccessfulRegistrationSchema = Static<
    typeof successfulRegistration
>;
export type UsernameExistsSchema = Static<typeof usernameExists>;
export type MissingFieldsSchema = Static<typeof missingFields>;
export type ErrorCreatingUserSchema = Static<typeof errorCreatingUser>;
export type ErrorVerifyingTokenSchema = Static<typeof errorVerifyingToken>;
export type InvalidCredentialsSchema = Static<typeof invalidCredentials>;
export type InvalidKeySchema = Static<typeof invalidKey>;
export type UserNotFoundSchema = Static<typeof userNotFound>;
export type InvalidTokenSchema = Static<typeof invalidToken>;
export type ValidTokenSchema = Static<typeof validToken>;
export type GetTokenBodySchema = Static<typeof getTokenBody>;
export type GetTokenResponseSchema = Static<typeof getTokenResponse>;
