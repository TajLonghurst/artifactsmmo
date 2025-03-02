import { env } from "../env.ts";
import character from "./api/actions/character.ts";
import FightChickens from "./commands/FightChickens.ts";
import MineCopperOre from "./commands/MineCopperOre.ts";

const Brains = async () => {
  MineCopperOre(env.CHARACTER);
  FightChickens(env.CHARACTER_ONE);
};

Brains();
