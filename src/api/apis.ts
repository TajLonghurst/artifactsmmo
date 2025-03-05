import axiosRetry from "axios-retry";
import { env } from "../../env.ts";
import axios from "axios";
import { ERROR_CODES } from "../utils/errorCodes.ts";

// const RETRY_ERROR_CODES = [500, 520];

export const applyAxiosRetry = (instance: any) => {
  axiosRetry(instance, {
    retries: 10,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition(error) {
      const status = error.response?.status;

      //Checks if the error exists
      const exists =
        status !== undefined &&
        (Object.values(ERROR_CODES) as number[]).includes(status);

      // if error doesn't exists then retry
      if (!exists) {
        console.error(`Retrying ${instance.defaults.baseURL} API`, status);
        return true;
      }

      return false; // don't retry
    },
  });
};

export const apiBase = axios.create({
  baseURL: env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + env.TOKEN,
  },
});
applyAxiosRetry(apiBase);

export const createApiActionInstance = (character: string) => {
  const apiAction = axios.create({
    baseURL: `${env.BASE_URL}/my/${character}`,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${env.TOKEN}`,
    },
  });

  applyAxiosRetry(apiAction);

  return apiAction;
};

export const apiAccount = axios.create({
  baseURL: env.BASE_URL + "/accounts/" + env.ACCOUNT_NAME,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer " + env.TOKEN,
  },
});

applyAxiosRetry(apiAccount);
