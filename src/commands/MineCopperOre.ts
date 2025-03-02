import {
  gathering,
  movement,
  character as characterStats,
} from "../api/actions";
import { cooldownDelay } from "../utils/cooldownDelay";

const MineCopperOre = async (character: string) => {
  await preSetUp(character);
  await moveToLocation(character);

  mining(character);
};

const mining = async (character: string) => {
  const {
    status,
    cooldown,
    character: characterGathering,
  } = await gathering(character);

  console.log("Collect Ore", status);

  const totalItems = characterGathering?.inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (totalItems === 100) {
    console.log("Inventory Maxed", character);
    return;
  }

  if (status === 200) {
    setTimeout(() => mining(character), cooldown!.total_seconds * 1000);
  }
};

const preSetUp = async (character: string) => {
  const { status: statusCharacterStats, cooldown: cooldownCharacterStats } =
    await characterStats(character);

  if (cooldownCharacterStats && statusCharacterStats === 200) {
    console.log(
      character + " " + "Character Current Cooldown",
      cooldownCharacterStats
    );
    await cooldownDelay(cooldownCharacterStats);
  }
};

const moveToLocation = async (character: string) => {
  const { status: statusMovement, cooldown: cooldownMovement } = await movement(
    character,
    { x: 2, y: 0 }
  );

  if (statusMovement === 200) {
    await cooldownDelay(cooldownMovement!.total_seconds);
  }
};

export default MineCopperOre;
