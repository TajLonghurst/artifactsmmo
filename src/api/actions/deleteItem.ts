import { AxiosError } from "axios";
import { Character, Cooldown, ItemResponse } from "../../types/types";
import { createApiActionInstance } from "../apis";
import { errorCode } from "../../utils/errorCodes";

type Data = {
  data: {
    cooldown: Cooldown;
    item: ItemResponse;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  item?: ItemResponse;
  character?: Character;
}

export default async function deleteItem(
  character: string,
  values: {
    code: string;
    quantity: number;
  }
): Promise<ApiResponse> {
  try {
    const api = createApiActionInstance(character);
    const body = { code: values.code, quantity: values.quantity };

    const response = await api.post<Data>("/action/delete", body);

    return {
      status: response.status,
      cooldown: response.data?.data.cooldown,
      character: response.data?.data.character,
      item: response.data?.data.item,
    };
  } catch (err: any) {
    if (err instanceof AxiosError) {
      const statusCode = err.response?.status;
      const errorKey = statusCode ? errorCode(statusCode) : "Unknown Error";

      console.error(
        `Error Delete API: ${character} ${errorKey}` + " " + statusCode
      );
    } else {
      console.error("Unexpected Error:", err);
    }

    return {
      status: err.status || 500, // Fallback to 500 if response is missing
    };
  }
}
