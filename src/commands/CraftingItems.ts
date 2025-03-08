import bankItemsList from "../api/account/bankItemsList";
import {
  character as characterStats,
  crafting,
  depositBank,
  movement,
  withdrawBank,
} from "../api/actions";
import recycling from "../api/actions/recycling";
import items from "../api/items/items";
import { Character, CraftItem, workshop } from "../types/types";
import { cooldownDelay } from "../utils/cooldownDelay";
import { moveToWorkshopLocation } from "../utils/moveToWorkshopLocation";

const CraftingItems = async (
  character: string,
  query: { itemToCraft: string },
  settings: { isRecycle: boolean }
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
    { isRecycle: settings.isRecycle },
    { characterCharacterStats }
  );
};

const craftingItem = async (
  character: string,
  query: { itemToCraft: string },
  settings: { isRecycle: boolean },
  characterStats: { characterCharacterStats?: Character }
) => {
  const { characterCharacterStats } = characterStats;

  const { data: dataItem, status: statusItem } = await items({
    querys: { code: query.itemToCraft },
  });

  if (statusItem !== 200) {
    console.log("Failed to find item");
    return;
  }

  const itemRecipe = dataItem!.craft.items;
  const workshopLocation = dataItem!.craft.skill as workshop;

  let resourceChunks = await chunkResourcesBalanced(
    itemRecipe,
    characterCharacterStats!
  );

  if (!resourceChunks || resourceChunks.length === 0) {
    console.log("No more resources available to craft.");
    return; // Exit the loop when resources are exhausted
  }

  console.log("resourceChunks", resourceChunks);

  while (resourceChunks && resourceChunks.length > 0) {
    for (const list of resourceChunks) {
      const currentQuantity = list.reduce(
        (total, item) => total + item.quantity,
        0
      );

      const individualItem = itemRecipe.reduce(
        (total, item) => total + item.quantity,
        0
      );

      const craftingQuantity = Math.floor(currentQuantity / individualItem);

      for (const items of list) {
        const { status: statusWithdrawBank, cooldown: cooldownWithdrawBank } =
          await withdrawBank(character, {
            quantity: items.quantity,
            code: items.code,
          });

        if (statusWithdrawBank === 200) {
          await cooldownDelay(cooldownWithdrawBank!.total_seconds);
        }
      }

      await moveToWorkshopLocation({
        character,
        query: { workshop: workshopLocation },
      });

      const { status: statusCrafting, cooldown: cooldownCrafting } =
        await crafting(character, {
          code: query.itemToCraft,
          quantity: craftingQuantity,
        });

      if (statusCrafting === 200)
        await cooldownDelay(cooldownCrafting!.total_seconds);

      if (settings.isRecycle) {
        /// Recycle
        const { status: statusRecycling, cooldown: cooldownRecycling } =
          await recycling(character, {
            code: query.itemToCraft,
            quantity: craftingQuantity,
          });

        if (statusRecycling !== 200) {
          console.log("failed recycling");
        }
        await cooldownDelay(cooldownRecycling!.total_seconds);
      }

      const {
        status: statusMovement,
        cooldown: cooldownMovement,
        character: characterMovement,
      } = await movement(character, { x: 4, y: 1 });

      if (statusMovement !== 200) {
        console.log("failed movement");
        return;
      }

      await cooldownDelay(cooldownMovement!.total_seconds);

      const inventoryList = characterMovement!.inventory
        .filter((item) => item.code !== "" && item.quantity > 0)
        .map((item) => ({
          code: item.code,
          quantity: item.quantity,
        }));

      //* Loop through all items in inventory and deposit them in the bank
      for (const item of inventoryList) {
        const { status: statusDepositBank, cooldown: cooldownDepositBank } =
          await depositBank(character, {
            code: item.code,
            quantity: item.quantity,
          });

        if (statusDepositBank !== 200) {
          console.error("Failed to deposit bank item");
        }

        await cooldownDelay(cooldownDepositBank!.total_seconds);
      }
    }

    // 🔥 Recalculate resources after depositing to check for new crafting opportunities
    resourceChunks = await chunkResourcesBalanced(
      itemRecipe,
      characterCharacterStats!
    );

    if (!resourceChunks || resourceChunks.length === 0) {
      console.log("No more resources available to craft.");
      break; // Exit the loop if no new resources are available
    }
  }
};

async function chunkResourcesBalanced(
  recipe: CraftItem[],
  characterCharacterStats: Character
) {
  const { data: dataBankItemsList, status: statsBankItemsList } =
    await bankItemsList({});

  if (statsBankItemsList !== 200) {
    console.log("Failed to find Bank Items List");
    return;
  }
  const bankItemList = dataBankItemsList!.data;

  // Create a map of bank items by their code for easy lookup
  const bankMap = new Map(
    bankItemList.map((item) => [item.code, item.quantity])
  );

  // Calculate how many times the item can be crafted based on the available resources
  let maxCraftable = Infinity;

  // Loop through each item in the recipe and calculate how many times it can be crafted
  for (const craftItem of recipe) {
    const availableQuantity = bankMap.get(craftItem.code) || 0;
    const craftableQuantity = Math.floor(
      availableQuantity / craftItem.quantity
    );

    // Update maxCraftable to be the limiting factor
    maxCraftable = Math.min(maxCraftable, craftableQuantity);
  }

  // Define a map to store the total amount of each resource required
  const maxItems = characterCharacterStats!.inventory_max_items; //! this character stats only comes from API that is only called once. And never called again in the crafting loop

  // Calculate total resources needed for crafting
  const totalRecipeResources: { [key: string]: number } = {};

  for (const craftItem of recipe) {
    const totalRequired = craftItem.quantity * maxCraftable;
    if (totalRecipeResources[craftItem.code]) {
      totalRecipeResources[craftItem.code] += totalRequired;
    } else {
      totalRecipeResources[craftItem.code] = totalRequired;
    }
  }

  const totalResourcesRequired: { code: string; quantity: number }[] =
    recipe.map((item) => ({
      code: item.code,
      quantity: item.quantity * maxCraftable,
    }));

  const chunks: Array<Array<{ code: string; quantity: number }>> = [];
  let remainingResources = [...totalResourcesRequired];

  while (remainingResources.some((res) => res.quantity > 0)) {
    let currentChunk: { code: string; quantity: number }[] = [];
    let currentChunkQuantity = 0;

    const maxSetsInChunk = Math.floor(
      maxItems / recipe.reduce((sum, item) => sum + item.quantity, 0)
    );

    for (const resource of recipe) {
      const needed = resource.quantity * maxSetsInChunk;
      const available = remainingResources.find(
        (r) => r.code === resource.code
      )!;

      const quantityToAdd = Math.min(needed, available.quantity);

      currentChunk.push({ code: resource.code, quantity: quantityToAdd });
      currentChunkQuantity += quantityToAdd;

      available.quantity -= quantityToAdd;
    }

    chunks.push(currentChunk);
  }

  return chunks;
}

const preSteUp = async (
  character: string,
  characterStats: { characterCharacterStats?: Character }
) => {
  const { characterCharacterStats } = characterStats;

  const filteredInventory = characterCharacterStats!.inventory.filter(
    (invItem) => invItem.code !== "" && invItem.quantity !== 0
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

  if (filteredInventory.length > 0) {
    for (const item of filteredInventory) {
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

export default CraftingItems;

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

//* Find how many items of the needed resource are in bank
//* divided that by how many times I can with draw that recipe.
//* Then withdraw the max amount of resources I can hold and loop until I can withdraw no more items that from the bank

// [
//   [
//     { code: "copper", quantity: 85 },
//     { code: "feather", quantity: 34 },
//   ],
//   [
//     { code: "copper", quantity: 85 },
//     { code: "feather", quantity: 34 },
//   ],
//   [
//     { code: "copper", quantity: 10 },
//     { code: "feather", quantity: 4 },
//   ],
// ]
