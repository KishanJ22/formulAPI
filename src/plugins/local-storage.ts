import { AsyncLocalStorage } from "async_hooks";

export interface StoreUser {
    username: string;
    first_name: string;
    last_name: string;
    role: string;
}

const asyncLocalStorage = new AsyncLocalStorage();

export const getAsyncLocalStorage = () => asyncLocalStorage.getStore() as StoreUser;

export const setAsyncLocalStorage = (store: StoreUser) =>
    asyncLocalStorage.enterWith(store);
