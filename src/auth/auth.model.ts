import prisma from "../db";

export const getAuthSecret = async (
    username: string,
): Promise<{ username: string, key: string }[]> => {
    // prisma query raw is used to return the results of an SQL statement in an array
    return prisma.$queryRaw<{ username: string, key: string }[]>`select
        u.username as username,
        ds.decrypted_secret as key
        from
        public.users u
        join vault.decrypted_secrets ds on u.user_secret_id = ds.id
        where u.username = ${username};`;
};
