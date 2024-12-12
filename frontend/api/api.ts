import { AuthApi, Configuration, UsersApi } from "@/generated-axios";

export const configuration = new Configuration();

export const usersApi = new UsersApi(configuration);

export const authApi = new AuthApi(configuration);
