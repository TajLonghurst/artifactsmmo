import axios, { AxiosError } from "axios";
import { Character, Cooldown } from "../../types/types";
import { env } from "../../../env";
import { errorCode } from "../../utils/errorCodes";

type Data = {
  data: Character[];
};

interface ApiResponse {
  status: number;
  character?: Character;
  cooldown?: Character["cooldown"];
}

export default async function character(character: string) {
  try {
    const response = await axios.get<Data>("/my/characters", {
      baseURL: env.BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${env.TOKEN}`,
      },
    });

    const getCharacter = response.data.data
      .filter((char) => char.name === character)
      .pop();

    return {
      status: response.status,
      character: getCharacter,
      cooldown: getCharacter?.cooldown,
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
