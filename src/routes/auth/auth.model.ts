import { prisma } from "../../config";

export const getUserKey = async (username: string): Promise<string> => {
    // prisma query raw is used to return the results of an SQL statement in an array
    const query = await prisma.$queryRaw<{ key: string }[]>`select
        ds.decrypted_secret as key
        from
        public.users u
        join vault.decrypted_secrets ds on u.user_secret_id = ds.id
        where u.username = ${username};`;

    return query[0].key; // Returns the API key for the user with the given username
};

export const getUserById = async (id: string) => {
    return prisma.public_users.findUnique({
        where: {
            id,
        },
    });
};

export const getUserByUsername = async (username: string) => {
    return prisma.public_users.findUnique({
        where: {
            username,
        },
    });
};
