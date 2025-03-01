import { Character, Cooldown, Fight } from "../../types/types";
import { apiActions as api } from "../apis";

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

export default async function fight(): Promise<ApiResponse> {
  try {
    const response = await api.post<Data>("/action/fight");

    return {
      status: response.status,
      character: response.data.data.character,
      cooldown: response.data.data.cooldown,
      fight: response.data.data.fight,
    };
  } catch (err: any) {
    console.error("Fight API Error:", err.response.status);
    return {
      status: err.response.status,
    };
  }
}
