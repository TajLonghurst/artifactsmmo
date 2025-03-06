import { gathering, character as characterStats } from "../api/actions";
import { ItemCraft, ResourceDrops, workshop } from "../types/types";
import { cooldownDelay } from "../utils/cooldownDelay";
import { inventoryManagement } from "../utils/inventoryManagement";
import { moveToResourceLocation } from "../utils/moveToResourceLocation";

const GatherResource = async (
  character: string,
  query: { drop: ResourceDrops; workshop?: workshop; item?: ItemCraft }
) => {
  await preSetUp(character);
  await moveToResourceLocation({ character, query: { drop: query.drop } });

  gather(character, {
    drop: query.drop,
    item: query.item,
    workshop: query.workshop,
  });
};

const gather = async (
  character: string,
  query: { drop: ResourceDrops; workshop?: workshop; item?: ItemCraft }
) => {
  const {
    status,
    cooldown,
    character: characterGathering,
  } = await gathering(character);

  if (status === 497) {
    // console.log("Failed");
    await inventoryManagement(character, {
      drop: query.drop,
      craft: query.item,
      workshop: query.workshop,
    });
  }

  console.log("Collect Resource", status);
  await cooldownDelay(cooldown!.total_seconds);

  const maxInventory = characterGathering!.inventory_max_items;

  const totalItems = characterGathering!.inventory.reduce(
    (value, item) => value + item.quantity,
    0
  );

  if (totalItems >= maxInventory) {
    await inventoryManagement(character, {
      drop: query.drop,
      craft: query.item,
      workshop: query.workshop,
    });

    console.log("END OF INV MAGMENT");
  }

  gather(character, {
    drop: query.drop,
    item: query.item,
    workshop: query.workshop,
  });
};

const preSetUp = async (character: string) => {
  const { status: statusCharacterStats, cooldown: cooldownCharacterStats } =
    await characterStats(character);

  if (statusCharacterStats === 200) {
    console.log(
      character + " " + "Character Current Cooldown",
      cooldownCharacterStats
    );
    await cooldownDelay(cooldownCharacterStats!);
  }
};

export default GatherResource;
