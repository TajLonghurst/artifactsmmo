import bankItemsList from "../api/account/bankItemsList";
import {
  character as characterStats,
  depositBank,
  movement,
  withdrawBank,
} from "../api/actions";
import items from "../api/items/items";
import { Character, Item } from "../types/types";
import { cooldownDelay } from "../utils/cooldownDelay";

export const CraftingItems = async (
  character: string,
  query: { itemToCraft: string },
  settings: { quantity: number | "max"; isDelete: boolean }
) => {
  const {
    status: statusCharacterStats,
    cooldown: cooldownCharacterStats,
    character: characterCharacterStats,
  } = await characterStats(character);

  if (statusCharacterStats === 200) {
    console.log(
      character + " " + "Character Current Cooldown",
      cooldownCharacterStats
    );
    await cooldownDelay(cooldownCharacterStats!);
  }

  await preSteUp(character, { characterCharacterStats });
  await craftingItem(
    character,
    { itemToCraft: query.itemToCraft },
    { quantity: settings.quantity, isDelete: settings.isDelete },
    { characterCharacterStats }
  );
};

const craftingItem = async (
  character: string,
  query: { itemToCraft: string },
  settings: { quantity: number | "max"; isDelete: boolean },
  characterStats: { characterCharacterStats?: Character }
) => {
  const { characterCharacterStats } = characterStats;

  const { status: statusItem, data: dataItem } = await items({
    querys: { code: query.itemToCraft },
  });

  if (statusItem !== 200) {
    console.log("Failed to find item");
    return;
  }

  const characterMaxInventory = characterCharacterStats!.inventory_max_items;
  const itemCraft = dataItem!.craft.items;

  let totalQuantity = itemCraft.reduce((sum, item) => sum + item.quantity, 0);
  let totalCrafts: Item[] = [];

  // Keep adding until totalQuantity reaches the limit
  while (totalQuantity <= characterMaxInventory) {
    totalCrafts = itemCraft.map((item) => ({
      ...item,
      quantity: item.quantity + item.quantity,
    }));

    totalQuantity = itemCraft.reduce((sum, item) => sum + item.quantity, 0);
  }

  //TODO: Check bank invtneory

  const { data: dataBankItemsList, status: statsBankItemsList } =
    await bankItemsList({});

  if (statsBankItemsList !== 200) {
    console.log("Failed to find Bank Items List");
    return;
  }

  const existingResources = totalCrafts.every((craft) =>
    dataBankItemsList!.data.some((item) => item.code === craft.code)
  );

  const isItemsInBank = existingResources
    ? dataBankItemsList!.data.filter((item) =>
        totalCrafts.some((craft) => craft.code === item.code)
      )
    : [];

  if (!isItemsInBank) {
    console.log("Items aren't in bank");
    return;
  }

  const loopAbleAmount =
    isItemsInBank[0].quantity / dataItem!.craft.items[0].quantity;

  //TODO: withdraw the as many resources that are with in the bank OR only once if settings is set to a number
};

const preSteUp = async (
  character: string,
  characterStats: { characterCharacterStats?: Character }
) => {
  const { characterCharacterStats } = characterStats;

  const isInventoryEmpty = characterCharacterStats!.inventory.filter(
    (invItem) => {
      const isNotEmpty = invItem.code !== "" && invItem.quantity > 0;
      if (isNotEmpty) return [];
      return true;
    }
  );

  const { status: statusMovement, cooldown: cooldownMovement } = await movement(
    character,
    {
      x: 4,
      y: 1,
    }
  );

  if (statusMovement === 200) {
    await cooldownDelay(cooldownMovement!.total_seconds);
  }

  if (isInventoryEmpty.length > 0) {
    for (const item of isInventoryEmpty) {
      const { cooldown: cooldownDepositBank, status: statusDepositBank } =
        await depositBank(character, {
          code: item.code,
          quantity: item.quantity,
        });

      if (statusDepositBank === 200) {
        await cooldownDelay(cooldownDepositBank!.total_seconds);
      }
    }
  }
};

// -------------------------------- PRE SETUP
//? GET Character API => cooldown & inventory
//! Cooldown
//
//TODO: POST API Move => to bank
//! Cooldown
//
//? POST Deposit API => deposit all items
//* Clear inventory
//! Cooldown
// -------------------------------- PRE SETUP
//
//
//
//
//
//
//
//? GET single Item API ==> data.craft.items
//* Calculate character max inventory space. keep adding until the required material amount until reaches or just under on max amount of items i can hold
//
//? GET Bank Items API ==>
//* Check how many crafts of that Item can be made then loop that many times of max inventory crafts
//
//? POST withdraw  API ==> withdraw the bank items
//! Cooldown
//
//TODO: POST API Move => to workshop
//! Cooldown
//
//? POST Craft API => craft items
//! Cooldown

/////////////////
//* THE DELETE OR DEPOSIT IN BANK
//
//TODO: POST API Move => to bank
//! Cooldown
//
//? POST Deposit API => deposit all crafts
//! Cooldown
/////////////////
