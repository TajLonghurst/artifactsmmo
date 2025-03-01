import { Character, Cooldown, Details } from "../../types/types";
import { apiActions as api } from "../apis";

type Data = {
  data: {
    cooldown: Cooldown;
    details: Details;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  details?: Details;
  character?: Character;
}

export default async function crafting(
  code: string,
  quantity: number
): Promise<ApiResponse> {
  try {
    const body = { code, quantity };

    const response = await api.post<Data>("/action/crafting", body);

    return {
      status: response.status,
      cooldown: response.data?.data.cooldown,
      character: response.data?.data.character,
      details: response.data?.data.details,
    };
  } catch (err: any) {
    console.error("Crafting API Error:", err.response.status);

    return {
      status: err.response.status,
    };
  }
}
