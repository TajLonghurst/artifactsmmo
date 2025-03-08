import { fight, rest, character as characterStats } from "../api/actions";
import { ItemCraft, MonsterDrops, workshop } from "../types/types";
import { cooldownDelay } from "../utils/cooldownDelay";
import { inventoryManagement } from "../utils/inventoryManagement";
import { moveToMonsterLocation } from "../utils/moveToMonsterLocation";

const FightMonster = async (
  character: string,
  query: { drop: MonsterDrops; workshop?: workshop; item?: ItemCraft }
) => {
  await preSetUp(character);
  await moveToMonsterLocation({ character, query });

  fighting(character, {
    drop: query.drop,
    item: query.item,
    workshop: query.workshop,
  });
};

const fighting = async (
  character: string,
  query: { drop: MonsterDrops; workshop?: workshop; item?: ItemCraft }
) => {
  const {
    status: statusFight,
    cooldown: cooldownFight,
    character: characterFight,
  } = await fight(character);

  if (statusFight === 200) {
    console.log("Fought Monster " + character, statusFight);
    await cooldownDelay(cooldownFight!.total_seconds);
  }

  if (statusFight === 497) {
    await inventoryManagement(character, {
      drop: query.drop,
      craft: query.item,
      workshop: query.workshop,
    });
  }

  if (statusFight === 200) {
    //TODO: To improve this. You need to get the fight details and check if the next hit will kill you. If not then continue
    const isLowHealth =
      characterFight?.hp !== undefined &&
      characterFight.hp < 0.4 * characterFight!.max_hp; //If players health is at 30% hp

    if (isLowHealth) {
      await restFighter(character);
    }

    await fighting(character, {
      drop: query.drop,
      item: query.item,
      workshop: query.workshop,
    });
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
