import { fight, rest, character as characterStats } from "../api/actions";
import { MonsterDrops } from "../types/types";
import { cooldownDelay } from "../utils/cooldownDelay";
import { moveToMonsterLocation } from "../utils/moveToMonsterLocation";

const FightMonster = async (
  character: string,
  query: { drop: MonsterDrops }
) => {
  await preSetUp(character);
  await moveToMonsterLocation({ character, query });

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

  //TODO: Properly Check max inventory instead of setting number

  if (totalItems! >= 100) {
    console.log("Inventory Maxed", character);
    return;
  }

  if (statusFight === 200) {
    //TODO: To improve this. You need to get the fight details and check if the next hit will kill you. If not then continue
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

  if (statusCharacterStats === 200) {
    console.log(
      character + " " + "Character Current Cooldown",
      cooldownCharacterStats
    );

    await cooldownDelay(cooldownCharacterStats!);
    if (characterCharacterStats!.hp < characterCharacterStats!.max_hp) {
      await restFighter(character);
    }
  }
};

export default FightMonster;
