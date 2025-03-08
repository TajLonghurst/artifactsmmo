import { AxiosError } from "axios";
import { Character, Cooldown, Details, ItemResponse } from "../../types/types";
import { createApiActionInstance } from "../apis";
import { errorCode } from "../../utils/errorCodes";
import { string } from "zod";

type bank = {
  code: string;
  quantity: number;
};

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

export default async function recycling(
  character: string,
  values: {
    code: string;
    quantity: number;
  }
): Promise<ApiResponse> {
  const api = createApiActionInstance(character);
  const body = {
    code: values.code,
    quantity: values.quantity,
  };

  try {
    const response = await api.post<Data>("/action/recycling", body);

    return {
      status: response.status,
      cooldown: response.data.data.cooldown,
      details: response.data.data.details,
      character: response.data.data.character,
    };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      const statusCode = err.response?.status;
      const errorKey = statusCode ? errorCode(statusCode) : "Unknown Error";

      console.error(
        `Error Bank Deposit API: ${character} ${errorKey}` + " " + statusCode
      );
    } else {
      console.error("Unexpected Error:", err);
    }

    return {
      status: err.response?.status || 500, // Fallback to 500 if response is missing
    };
  }
}
