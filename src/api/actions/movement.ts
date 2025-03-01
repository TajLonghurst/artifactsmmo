import { Character, Cooldown, Destination } from "../../types/types";
import { apiActions as api } from "../apis";

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
  xAxis: number,
  yAxis: number
): Promise<ApiResponse> {
  const body = { x: xAxis, y: yAxis };

  try {
    const response = await api.post<Data>("/action/move", body);

    return {
      status: response.status,
      cooldown: response.data.data.cooldown,
      destination: response.data.data.destination,
      character: response.data.data.character,
    };
  } catch (err: any) {
    console.error("Movement API Error:", err.response.status);
    return {
      status: err.response.status,
    };
  }
}
