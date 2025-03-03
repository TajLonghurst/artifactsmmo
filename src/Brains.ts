import { env } from "../env.ts";
import FightMonster from "./commands/FightMonster.ts";
import GatherResource from "./commands/GatherResource.ts";

const Brains = () => {
  GatherResource(env.CHARACTER_TWO, { drop: "ash_wood" });
  GatherResource(env.CHARACTER_ONE, { drop: "copper_ore" });
  FightMonster(env.CHARACTER, { drop: "feather" });
};

Brains();

//TODO Delete resource not wanted optional

//TODO: Mining should also move to mining workshop to craft resource gathered

//TODO: All preSetUp needs to check inventory isn't full

//? Flow is Tell what weapone I want, It goes collect resourses then crafts it.
