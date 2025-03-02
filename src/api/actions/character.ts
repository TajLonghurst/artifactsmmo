import axios, { AxiosError } from "axios";
import { Character, Cooldown } from "../../types/types";

type Data = {
  data: {
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  character?: Character;
  cooldown?: Character["cooldown"];
}

export default async function character(
  character: string
): Promise<ApiResponse> {
  try {
    const response = await axios.get<Data>(
      "https://api.artifactsmmo.com/my/characters"
    );

    return {
      status: response.status,
      character: response.data.data.character,
      cooldown: response.data.data.character.cooldown,
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
