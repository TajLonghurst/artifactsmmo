import { AxiosError } from "axios";
import { Character, Cooldown, ItemResponse } from "../../types/types";
import { createApiActionInstance } from "../apis";
import { errorCode } from "../../utils/errorCodes";

type bank = {
  code: string;
  quantity: number;
};

type Data = {
  data: {
    cooldown: Cooldown;
    item: ItemResponse;
    bank: bank;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  bank?: bank;
  item?: ItemResponse;
  character?: Character;
}

export default async function depositBank(
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
    const response = await api.post<Data>("/action/bank/deposit", body);

    return {
      status: response.status,
      cooldown: response.data.data.cooldown,
      bank: response.data.data.bank,
      item: response.data.data.item,
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
