import {
  fight,
  movement,
  rest,
  character as characterStats,
} from "../api/actions";
import { cooldownDelay } from "../utils/cooldownDelay";

let currentCooldown: number;

const FightChickens = async (character: string) => {
  const {
    status: statusCharacterStats,
    cooldown: statusCooldown,
    character: characterCharacterStats,
  } = await characterStats(character);

  if (statusCharacterStats === 200) {
    if (characterCharacterStats!.hp < characterCharacterStats!.max_hp) {
      currentCooldown != statusCooldown;
      await cooldownDelay(currentCooldown);
      restFighter(character);
    }
  }

  const {
    status: statusMovement,
    cooldown: cooldownMovement,
    character: characterMovement,
  } = await movement(character, { x: 0, y: 1 });

  if (statusMovement === 200) {
    currentCooldown = cooldownMovement!.total_seconds;
    await cooldownDelay(currentCooldown);
  }

  fighting(character);
};

const fighting = async (character: string) => {
  const {
    status: statusFight,
    cooldown: cooldownFight,
    character: characterFight,
  } = await fight(character);

  currentCooldown = cooldownFight!.total_seconds;
  console.log("Fought Chicken", statusFight);

  await cooldownDelay(currentCooldown);

  restFighter(character);

  const totalItems = characterFight?.inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (totalItems === 100) {
    console.log("Inventory Maxed");
    return;
  }

  if (statusFight === 200) {
    setTimeout(() => fighting(character), currentCooldown * 1000);
  }
};

const restFighter = async (character: string) => {
  const {
    status: statusRest,
    cooldown: cooldownRest,
    character: characterRest,
  } = await rest(character);

  currentCooldown = cooldownRest!.total_seconds;
  console.log("Resting", statusRest);
  await cooldownDelay(currentCooldown);
};

export default FightChickens;
