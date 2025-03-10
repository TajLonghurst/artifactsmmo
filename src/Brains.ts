import { env } from "../env.ts";
import FightMonster from "./commands/FightMonster.ts";
import CraftingItems from "./commands/CraftingItems.ts";
import GatherResource from "./commands/GatherResource.ts";
import recycling from "./api/actions/recycling.ts";
import deleteItem from "./api/actions/deleteItem.ts";

const Brains = async () => {
  FightMonster(env.CHARACTER, { drop: "red_slimeball" });
  FightMonster(env.CHARACTER_TWO, { drop: "cowhide" });
  // GatherResource(env.CHARACTER, {
  //   drop: "iron_ore",
  //   workshop: "mining",
  //   item: "iron",
  // });
  GatherResource(env.CHARACTER_ONE, {
    drop: "coal",
  });
  // GatherResource(env.CHARACTER_TWO, {
  //   drop: "ash_wood",
  //   workshop: "woodcutting",
  //   item: "ash_plank",
  // });
  GatherResource(env.CHARACTER_THREE, {
    drop: "birch_wood",
  });
  GatherResource(env.CHARACTER_FOUR, {
    drop: "iron_ore",
    workshop: "mining",
    item: "iron",
  });
  // CraftingItems(
  //   env.CHARACTER,
  //   { itemToCraft: "life_amulet" },
  //   { isRecycle: true }
  // );
  // const { status } = await recycling(env.CHARACTER, {
  //   code: "copper_ring",
  //   quantity: 6,
  // });
  // const {} = await deleteItem(env.CHARACTER_TWO, {
  //   code: "copper_dagger",
  //   quantity: 1,
  // });
};

Brains();

//Fire staff gives 121xp

//sticky_sword 114px

// Taj Taj_Two FIGHTER
// Taj Taj_One Taj_Four MINER
// Taj_Two Taj_Three WOOD
