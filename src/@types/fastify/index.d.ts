import fastify from "fastify";

declare module "fastify" {
    export interface FastifyInstance<
        HttpServer = http.Server,
        HttpRequest = http.IncomingMessage,
        HttpResponse = http.ServerResponse
    > 
    {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        authorize: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}