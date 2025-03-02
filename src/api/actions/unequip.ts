import { Character, Cooldown, UnEquipItem, Slot } from "../../types/types";
import { createApiActionInstance } from "../apis";
import character from "./character";

type Data = {
  data: {
    cooldown: Cooldown;
    slot: Slot;
    item: UnEquipItem;
    character: Character;
  };
};

interface ApiResponse {
  status: number;
  cooldown?: Cooldown;
  slot?: Slot;
  item?: UnEquipItem;
  character?: Character;
}

export default async function unequip(
  character: string,
  values: {
    slot: string;
    quantity: number;
  }
): Promise<ApiResponse> {
  const api = createApiActionInstance(character);
  const body = { slot: values.slot, quantity: values.quantity };

  try {
    const response = await api.post<Data>("/action/unequip", body);

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
