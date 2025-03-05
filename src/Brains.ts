import { env } from "../env.ts";
import Items from "./api/items/items.ts";
import FightMonster from "./commands/FightMonster.ts";
import GatherResource from "./commands/GatherResource.ts";

const Brains = async () => {
  // GatherResource(env.CHARACTER_TWO, { drop: "ash_wood" });
  //   GatherResource(env.CHARACTER_TWO, { drop: "ash_wood", craft: "mining", item: "copper" }); //If I don't specify the item and location it just drop items in bank
  // GatherResource(env.CHARACTER_ONE, { drop: "copper_ore" });
  // GatherResource(env.CHARACTER, { drop: "copper_ore" });
  // FightMonster(env.CHARACTER_THREE, { drop: "feather" });
  //CraftItem resources -> Item -> Delete
  // const { data } = await Items({ querys: { code: "gudgeon" } });
  // console.log(data);
};

Brains();

//TODO: Mining should also move to mining workshop to craft resource gathered

//TODO: All preSetUp needs to check inventory isn't full

//TODO: Have a crafter take the resources from the bank upgrade them into Items
