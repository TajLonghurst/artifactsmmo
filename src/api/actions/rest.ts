import { AxiosError } from "axios";
import { Character, Cooldown } from "../../types/types";
import { errorCode } from "../../utils/errorCodes";
import { createApiActionInstance } from "../apis";

type Data = {
  data: {
    cooldown: Cooldown;
    hp_restored: number;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  hp_restored?: number;
  character?: Character;
}

export default async function rest(character: string): Promise<ApiResponse> {
  const api = createApiActionInstance(character);

  try {
    const response = await api.post<Data>("/action/rest");

    return {
      status: response.status,
      hp_restored: response.data.data.hp_restored,
      cooldown: response.data.data.cooldown,
      character: response.data.data.character,
    };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      const statusCode = err.response?.status;
      const errorKey = statusCode ? errorCode(statusCode) : "Unknown Error";

      console.error(`Error: ${character} ${errorKey} (${statusCode})`);
    } else {
      console.error("Unexpected Error:", err);
    }

    return {
      status: err.response?.status || 500, // Fallback to 500 if response is missing
    };
  }
}
