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
  const { status: statusGathering, cooldown } = await gathering(character);

  if (statusGathering === 200) {
    console.log("Collect Resource " + character, statusGathering);
    await cooldownDelay(cooldown!.total_seconds);
  }

  if (statusGathering === 497) {
    await inventoryManagement(character, {
      drop: query.drop,
      craft: query.item,
      workshop: query.workshop,
    });
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
