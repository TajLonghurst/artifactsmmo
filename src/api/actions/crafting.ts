import { Character, Cooldown, Details } from "../../types/types";
import { createApiActionInstance } from "../apis";

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
  character: string,
  values: {
    code: string;
    quantity: number;
  }
): Promise<ApiResponse> {
  try {
    const api = createApiActionInstance(character);
    const body = { code: values.code, values: values.quantity };

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
