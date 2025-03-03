import axios, { AxiosError } from "axios";
import { Character, Cooldown, Fight } from "../../types/types";
import { createApiActionInstance } from "../apis";
import { errorCode } from "../../utils/errorCodes";
import axiosRetry from "axios-retry";

type Data = {
  data: {
    cooldown: Cooldown;
    fight: Fight;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  fight?: Fight;
  character?: Character;
}

export default async function fight(character: string): Promise<ApiResponse> {
  const api = createApiActionInstance(character);

  try {
    const response = await api.post<Data>("/action/fight");

    return {
      status: response.status,
      character: response.data.data.character,
      cooldown: response.data.data.cooldown,
      fight: response.data.data.fight,
    };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      const statusCode = err.response?.status;
      const errorKey = statusCode ? errorCode(statusCode) : "Unknown Error";

      console.error(
        `Error Fight API: ${character} ${errorKey}` + " " + statusCode
      );
    } else {
      console.error("Unexpected Error:", err);
    }

    return {
      status: 500,
    };
  }
}
