import { movement } from "../api/actions";
import map from "../api/map/map";
import { Character, ResourceDrops, workshop } from "../types/types";
import { cooldownDelay } from "./cooldownDelay";

interface IMoveToWorkshopLocation {
  character: string;
  query: {
    workshop: workshop;
  };
}

export const moveToWorkshopLocation = async ({
  character,
  query,
}: IMoveToWorkshopLocation): Promise<{ character?: Character }> => {
  const { workshop } = query;

  const coordinates = await map({ querys: { content_code: workshop } });

  if (!coordinates) {
    throw new Error("Failed to find workshop location");
  }

  const x = coordinates!.data[0].x;
  const y = coordinates!.data[0].y;

  const {
    status: statusMovement,
    cooldown: cooldownMovement,
    character: characterMovement,
  } = await movement(character, { x: x, y: y });

  if (statusMovement === 200) {
    await cooldownDelay(cooldownMovement!.total_seconds);
  }

  return { character: characterMovement };
};
