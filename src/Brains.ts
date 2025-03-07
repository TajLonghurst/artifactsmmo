import { env } from "../env.ts";
import FightMonster from "./commands/FightMonster.ts";
import GatherResource from "./commands/GatherResource.ts";

const Brains = () => {
  GatherResource(env.CHARACTER, {
    drop: "iron_ore",
    workshop: "mining",
    item: "iron",
  });
  GatherResource(env.CHARACTER_ONE, {
    drop: "iron_ore",
    workshop: "mining",
    item: "iron",
  });
  GatherResource(env.CHARACTER_TWO, {
    drop: "spruce_wood",
    workshop: "woodcutting",
    item: "spruce_plank",
  });
  GatherResource(env.CHARACTER_THREE, {
    drop: "spruce_wood",
    workshop: "woodcutting",
    item: "spruce_plank",
  });
  GatherResource(env.CHARACTER_FOUR, {
    drop: "copper_ore",
    workshop: "mining",
    item: "copper",
  });
  // FightMonster(env.CHARACTER_THREE, { drop: "feather" });
  //CraftItem(player{drop, drop, drop, drop, workshop, item})
};

Brains();

//TODO: Have a crafter take the resources from the bank upgrade them into Items

//* CraftItem(player{craftedItem} {delete, quantity})
//* Start at bank ==> withdraw all drops or items needed ==> move to workshop ==> Craft Item in mass ==> Deposit ? Delete ==> Loop

//*quantity: number | "max";
