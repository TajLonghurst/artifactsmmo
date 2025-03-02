import {
  Character,
  Cooldown,
  UnEquipItem as EquipItem,
  Slot,
} from "../../types/types";
import { createApiActionInstance } from "../apis";

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
    console.error("UnEquip API Error:", err.response.status);

    return {
      status: err.response.status,
    };
  }
}
