import { Character, Cooldown } from "../../types/types";
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
    console.error("Rest API Error:", err.response.status);
    return {
      status: err.response.status,
    };
  }
}
