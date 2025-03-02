import { env } from "../../env";
import {
  fight,
  movement,
  rest,
  character as characterStats,
} from "../api/actions";
import { cooldownDelay } from "../utils/cooldownDelay";

const FightChickens = async (character: string) => {
  const {
    status: statusCharacterStats,
    cooldown: cooldownCharacterStats,
    character: characterCharacterStats,
  } = await characterStats(env.CHARACTER_ONE);

  if (cooldownCharacterStats && statusCharacterStats === 200) {
    console.log("Cooldown Character API", cooldownCharacterStats);
    await cooldownDelay(cooldownCharacterStats);
    if (characterCharacterStats!.hp < characterCharacterStats!.max_hp) {
      await restFighter(character);
    }
  }

  const { status: statusMovement, cooldown: cooldownMovement } = await movement(
    character,
    { x: 0, y: 1 }
  );

  if (statusMovement === 200) {
    await cooldownDelay(cooldownMovement!.total_seconds);
  }

  fighting(character);
};

const fighting = async (character: string) => {
  const {
    status: statusFight,
    cooldown: cooldownFight,
    character: characterFight,
  } = await fight(character);

  await cooldownDelay(cooldownFight!.total_seconds);
  console.log("Fought Chicken", statusFight);

  const totalItems = characterFight?.inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (totalItems === 100) {
    console.log("Inventory Maxed", character);
    return;
  }

  if (statusFight === 200) {
    //! To improve this. You need to get the fight details and check if the next hit will kill you. If not then continue
    const isLowHealth =
      characterFight?.hp !== undefined &&
      characterFight.hp < 0.3 * characterFight!.max_hp; //If players health is at 30% hp

    if (isLowHealth) {
      console.log("RESET 30%");
      await restFighter(character);
    }
    setTimeout(() => fighting(character), 0);
  }
};

const restFighter = async (character: string) => {
  const { status: statusRest, cooldown: cooldownRest } = await rest(character);

  //   currentCooldown = cooldownRest!.total_seconds;
  console.log("Resting", statusRest);
  await cooldownDelay(cooldownRest!.total_seconds);
};

export default FightChickens;
