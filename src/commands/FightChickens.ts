import {
  fight,
  movement,
  rest,
  character as characterStats,
} from "../api/actions";
import { cooldownDelay } from "../utils/cooldownDelay";

const FightChickens = async (character: string) => {
  await preSetUp(character);
  await moveToLocation(character);

  fighting(character);
};

const fighting = async (character: string) => {
  const {
    status: statusFight,
    cooldown: cooldownFight,
    character: characterFight,
  } = await fight(character);

  console.log("Fought Chicken", statusFight);
  await cooldownDelay(cooldownFight!.total_seconds);

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
      await restFighter(character);
    }
    await fighting(character);
  }
};

const restFighter = async (character: string) => {
  const { cooldown: cooldownRest } = await rest(character);
  await cooldownDelay(cooldownRest!.total_seconds);
};

const preSetUp = async (character: string) => {
  const {
    status: statusCharacterStats,
    cooldown: cooldownCharacterStats,
    character: characterCharacterStats,
  } = await characterStats(character);

  if (cooldownCharacterStats && statusCharacterStats === 200) {
    console.log(
      character + " " + "Character Current Cooldown",
      cooldownCharacterStats
    );
    await cooldownDelay(cooldownCharacterStats);
    if (characterCharacterStats!.hp < characterCharacterStats!.max_hp) {
      await restFighter(character);
    }
  }
};

const moveToLocation = async (character: string) => {
  const { status: statusMovement, cooldown: cooldownMovement } = await movement(
    character,
    { x: 0, y: 1 }
  );

  if (statusMovement === 200) {
    await cooldownDelay(cooldownMovement!.total_seconds);
  }
};

export default FightChickens;
