import prisma from "../db";

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

export const getUsers = async () => await prisma.public_users.findMany();

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

export const createUser = async (
    id: string,
    username: string,
    first_name: string,
    last_name: string,
) => {
    const raw_user_meta_data = {
        username,
        first_name,
        last_name,
        role: "authenticated",
    };

    const created_at = new Date();

    const user = await prisma.auth_users.create({
        data: {
            id,
            raw_user_meta_data,
            created_at,
        },
    });

    return user;
};
