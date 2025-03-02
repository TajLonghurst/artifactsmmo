import { env } from "../env.ts";
import map from "./api/map/map.ts";
import resources from "./api/resources/ resources.ts";
import FightChickens from "./commands/FightChickens.ts";
import MineResource from "./commands/MineResource.ts";

const Brains = () => {
  MineResource(env.CHARACTER, { dropType: "copper_ore" });
  // MineCopperOre(env.CHARACTER_ONE);
  // FightChickens(env.CHARACTER);
};

Brains();
