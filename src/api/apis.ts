import { env } from "../../env.ts";
import axios from "axios";

export const apiMap = axios.create({
  baseURL: env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + env.TOKEN,
  },
});

export const createApiActionInstance = (character: string) => {
  return axios.create({
    baseURL: `${env.BASE_URL}/my/${character}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${env.TOKEN}`,
    },
  });
};

export const apiAccount = axios.create({
  baseURL: env.BASE_URL + "/accounts/" + env.ACCOUNT_NAME,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + env.TOKEN,
  },
});
