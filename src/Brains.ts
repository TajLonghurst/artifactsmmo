import { env } from "../env.ts";
import FightMonster from "./commands/FightMonster.ts";
import MineResource from "./commands/MineResource.ts";

const Brains = () => {
  MineResource(env.CHARACTER_ONE, { drop: "copper_ore" });
  FightMonster(env.CHARACTER, { drop: "feather" });
};

Brains();
//! handle all 500 as redo api call

//! Delete resource not wanted optional
