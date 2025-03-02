import { AxiosError } from "axios";
import {
  Character,
  Cooldown,
  UnEquipItem as EquipItem,
  Slot,
} from "../../types/types";
import { createApiActionInstance } from "../apis";
import { errorCode } from "../../utils/errorCodes";

type Data = {
  data: {
    cooldown: Cooldown;
    slot: Slot;
    item: EquipItem;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  slot?: Slot;
  item?: EquipItem;
  character?: Character;
}

export default async function equip(
  character: string,
  values: {
    slot: string;
    quantity: number;
    code?: string;
  }
): Promise<ApiResponse> {
  const api = createApiActionInstance(character);
  const body = {
    slo: values.slot,
    quantity: values.quantity,
    code: values.code,
  };

  try {
    const response = await api.post<Data>("/action/equip", body);

    return {
      status: response.status,
      cooldown: response.data.data.cooldown,
      slot: response.data.data.slot,
      item: response.data.data.item,
      character: response.data.data.character,
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
