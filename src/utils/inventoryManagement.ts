import { crafting, depositBank, movement } from "../api/actions";
import Items from "../api/items/items";
import { ItemCraft, ResourceDrops, workshop } from "../types/types";
import { cooldownDelay } from "./cooldownDelay";
import { moveToResourceLocation } from "./moveToResourceLocation";
import { moveToWorkshopLocation } from "./moveToWorkshopLocation";

export const inventoryManagement = async (
  character: string,
  values: {
    drop: ResourceDrops;
    craft?: ItemCraft;
    workshop?: workshop;
  }
) => {
  const { drop, craft, workshop } = values;

  if (workshop && craft) {
    //* Move to location
    const { character: characterMoveToWorkshopLocation } =
      await moveToWorkshopLocation({
        character,
        query: { workshop },
      });

    const { data, status } = await Items({ querys: { code: craft } });

    if (status !== 200) {
      throw new Error("cound't find item");
    }

    const craftQuantity = data!.craft.items[0].quantity;

    //* Find drop
    const inventoryItem = characterMoveToWorkshopLocation?.inventory.find(
      (item) => item.code === drop
    );

    //* Rounded down the drop inventory
    const inventoryAmountRounded =
      Math.floor((inventoryItem?.quantity ?? 0) / craftQuantity) *
      craftQuantity;

    //* divide the inventory drop by the needed craft amount
    const quantityAmount = inventoryAmountRounded / craftQuantity;

    const { status: statusCrafting, cooldown: cooldownCrafting } =
      await crafting(character, {
        code: craft,
        quantity: quantityAmount,
      });

    await cooldownDelay(cooldownCrafting!.total_seconds);

    if (statusCrafting !== 200) {
      console.error("Failed to craft Item");
      return;
    }
  }

  const {
    status,
    cooldown: cooldownMovement,
    character: characterMovement,
  } = await movement(character, {
    x: 4,
    y: 1,
  });

  if (status !== 200) {
    console.error("Failed to move");
  }

  await cooldownDelay(cooldownMovement!.total_seconds);

  //* Find all items in inventory and then filter out the drop.
  const inventoryList = characterMovement!.inventory
    .filter((item) => item.code !== drop)
    .map((item) => ({
      code: item.code,
      quantity: item.quantity,
    }));

  console.log(inventoryList, "THE DEPOSIT ITEMS LIST");
  //* Loop through all items in inventory and deposit it in bank
  for (const item of inventoryList) {
    const { status: statusDepositBank, cooldown: cooldownDepositBank } =
      await depositBank(character, {
        code: item.code,
        quantity: item.quantity,
      });

    if (statusDepositBank !== 200) {
      console.error("Failed to deposit bank item");
    }

    console.log("Bank Deposit", statusDepositBank);
    await cooldownDelay(cooldownDepositBank!.total_seconds);
  }
  //* move back to resource
  await moveToResourceLocation({ character, query: { drop } });
  return;
};
