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

export default async function gathering(): Promise<ApiResponse> {
  try {
    const response = await api.post<Data>("/action/gathering");

    return {
      status: response.status,
      cooldown: response.data?.data.cooldown,
      character: response.data?.data.character,
      details: response.data?.data.details,
    };
  } catch (err: any) {
    console.error("Gathering API Error:", err.response.status);

    return {
      status: err.response.status,
    };
  }
}
