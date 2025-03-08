import { env } from "../env.ts";
import FightMonster from "./commands/FightMonster.ts";
import CraftingItems from "./commands/CraftingItems.ts";
import GatherResource from "./commands/GatherResource.ts";

const Brains = async () => {
  FightMonster(env.CHARACTER, { drop: "yellow_slimeball" });

  // GatherResource(env.CHARACTER, {
  //   drop: "iron_ore",
  //   workshop: "mining",
  //   item: "iron",
  // });
  GatherResource(env.CHARACTER_ONE, {
    drop: "copper_ore",
    workshop: "mining",
    item: "copper",
  });
  GatherResource(env.CHARACTER_TWO, {
    drop: "ash_wood",
    workshop: "woodcutting",
    item: "ash_plank",
  });
  GatherResource(env.CHARACTER_THREE, {
    drop: "ash_wood",
    workshop: "woodcutting",
    item: "ash_plank",
  });
  GatherResource(env.CHARACTER_FOUR, {
    drop: "copper_ore",
    workshop: "mining",
    item: "copper",
  });
  // CraftingItems(
  //   env.CHARACTER,
  //   { itemToCraft: "ash_plank" },
  //   { isRecycle: false }
  // );
  // FightMonster(env.CHARACTER_THREE, { drop: "feather" });
};

Brains();
