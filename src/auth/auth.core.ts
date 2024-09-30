import { getAuthSecret } from "./auth.model";

export const getSecret = async (username: string, key: string): Promise<boolean> => {
    const secrets = await getAuthSecret(username);
    const userSecret = secrets.find((secret: any) => secret.key === key);

    if (!userSecret) {
        return false;
    }

    return true;
};
