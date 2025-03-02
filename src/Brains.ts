import { env } from "../env.ts";
import resources from "./api/resources/ resources.ts";
import FightMonster from "./commands/FightMonster.ts";
import MineResource from "./commands/MineResource.ts";

const Brains = async () => {
  MineResource(env.CHARACTER_ONE, { drop: "copper_ore" });
  FightMonster(env.CHARACTER, { drop: "feather" });
};

Brains();
//! handle all 500 as redo api call
