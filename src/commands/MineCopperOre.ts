import { gathering, movement } from "../api/actions";
import { cooldownDelay } from "../utils/cooldownDelay";

let currentCooldown: number;

const MineCopperOre = async (character: string) => {
  const { status: statusMovement, cooldown: cooldownMovement } = await movement(
    character,
    { x: 2, y: 0 }
  );

  if (statusMovement === 200) {
    currentCooldown = cooldownMovement!.total_seconds;
    await cooldownDelay(currentCooldown);
  }

  mining(character);
};

const mining = async (character: string) => {
  const {
    status,
    cooldown,
    character: characterGathering,
  } = await gathering(character);

  currentCooldown = cooldown!.total_seconds;
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
    setTimeout(() => mining(character), currentCooldown * 1000);
  }
};

export default MineCopperOre;
