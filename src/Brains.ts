import { env } from "../env.ts";
import FightMonster from "./commands/FightMonster.ts";
import GatherResource from "./commands/GatherResource.ts";

const Brains = () => {
  GatherResource(env.CHARACTER_TWO, {
    drop: "ash_wood",
    workshop: "woodcutting",
    item: "ash_plank",
  });
  GatherResource(env.CHARACTER_ONE, {
    drop: "copper_ore",
    workshop: "mining",
    item: "copper",
  });
  GatherResource(env.CHARACTER, {
    drop: "copper_ore",
    workshop: "mining",
    item: "copper",
  });
  // FightMonster(env.CHARACTER_THREE, { drop: "feather" });
};

Brains();

//TODO: Mining should also move to mining workshop to craft resource gathered

//TODO: All preSetUp needs to check inventory isn't full

//TODO: Have a crafter take the resources from the bank upgrade them into Items

//Move to mind
//
