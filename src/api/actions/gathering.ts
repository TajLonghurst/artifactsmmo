import { Axios, AxiosError } from "axios";
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

export default async function gathering(
  character: string
): Promise<ApiResponse> {
  const api = createApiActionInstance(character);
  try {
    const response = await api.post<Data>("/action/gathering");

    return {
      status: response.status,
      cooldown: response.data?.data.cooldown,
      character: response.data?.data.character,
      details: response.data?.data.details,
    };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      console.error(
        "Gathering API Error:",
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
