import {
  gathering,
  movement,
  character as characterStats,
} from "../api/actions";
import { ResourceDrops } from "../types/types";
import { cooldownDelay } from "../utils/cooldownDelay";
import { moveToResourceLocation } from "../utils/moveToResourceLocation";

const MineResource = async (
  character: string,
  query: { drop: ResourceDrops }
) => {
  await preSetUp(character);
  await moveToResourceLocation({ character, query });

  mining(character);
};

const mining = async (character: string) => {
  const {
    status,
    cooldown,
    character: characterGathering,
  } = await gathering(character);

  console.log("Collect Ore", status);
  await cooldownDelay(cooldown!.total_seconds);

  const totalItems = characterGathering?.inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (totalItems === 100) {
    console.log("Inventory Maxed", character);
    return;
  }

  if (status === 200) {
    await mining(character);
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

export default MineResource;
