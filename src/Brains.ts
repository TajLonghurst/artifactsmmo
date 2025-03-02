import { env } from "../env.ts";
import FightChickens from "./commands/FightChickens.ts";
import MineCopperOre from "./commands/MineCopperOre.ts";

const Brains = () => {
  MineCopperOre(env.CHARACTER);
  FightChickens(env.CHARACTER_ONE);
};

Brains();
