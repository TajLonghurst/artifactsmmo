import {
  gathering,
  movement,
  character as characterStats,
} from "../api/actions";
import { ItemCraft, ResourceDrops } from "../types/types";
import { cooldownDelay } from "../utils/cooldownDelay";
import { moveToResourceLocation } from "../utils/moveToResourceLocation";

const GatherResource = async (
  character: string,
  query: { drop: ResourceDrops; craft?: ItemCraft }
) => {
  await preSetUp(character);
  await moveToResourceLocation({ character, query });

  gather(character);
};

const gather = async (character: string) => {
  const {
    status,
    cooldown,
    character: characterGathering,
  } = await gathering(character);

  console.log("Collect Resource", status);
  await cooldownDelay(cooldown!.total_seconds);

  const totalItems = characterGathering?.inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  //TODO: Properly Check max inventory instead of setting number
  if (totalItems! >= 100) {
    console.log("Inventory Maxed", character);
    return;
  }

  if (status === 200) {
    await gather(character);
  }
};

const craftResource = async (character: string, craft: ItemCraft) => {
  const { status: statusMovement, cooldown: cooldownMovement } = await movement(
    character,
    { x: 1, y: 5 }
  );

  if (statusMovement === 200) {
    await cooldownDelay(cooldownMovement!.total_seconds);
  }
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
