import { AxiosError } from "axios";
import { Character, Cooldown, Destination } from "../../types/types";
import { createApiActionInstance } from "../apis";

type Data = {
  data: {
    cooldown: Cooldown;
    destination: Destination;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  destination?: Destination;
  character?: Character;
}

export default async function movement(
  character: string,
  axis: {
    x: number;
    y: number;
  }
): Promise<ApiResponse> {
  const api = createApiActionInstance(character);
  const body = { x: axis.x, y: axis.y };

  try {
    const response = await api.post<Data>("/action/move", body);

    return {
      status: response.status,
      cooldown: response.data.data.cooldown,
      destination: response.data.data.destination,
      character: response.data.data.character,
    };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      const statusCode = err.response?.status;

      if (statusCode === 490) {
        console.error(`${character} already on map title`);
      }
    } else {
      console.error("Unexpected Error:", err);
    }

    return {
      status: err.response?.status || 500, // Fallback to 500 if response is missing
    };
  }
}
