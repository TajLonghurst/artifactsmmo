import { AxiosError } from "axios";
import { Character, Cooldown, Fight } from "../../types/types";
import { createApiActionInstance } from "../apis";

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
      console.error(
        "Fighting API Error:",
        err.response?.status || "Unknown error"
      );
    } else {
      console.error("Unexpected Error:", err);
    }

    return {
      status: err.response?.status || 500, // Fallback to 500 if response is missing
    };
  }
}
