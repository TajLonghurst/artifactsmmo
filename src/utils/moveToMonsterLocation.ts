import map from "../api/map/map";
import monsters from "../api/monster/monsters";
import { movement } from "../api/actions";
import { MonsterDrops } from "../types/types";
import { cooldownDelay } from "./cooldownDelay";

interface IMoveToMonsterLocation {
  character: string;
  query: {
    drop: MonsterDrops;
  };
}

export const moveToMonsterLocation = async ({
  character,
  query,
}: IMoveToMonsterLocation) => {
  const { drop } = query;

  const { data, status: statusResource } = await monsters({
    querys: { drop: drop },
  });

  if (statusResource !== 200) {
    console.log("Failed to find monster drop");
    return;
  }

  const location = data?.data?.[0].code;

  const coordinates = await map({ querys: { content_code: location } });

  if (!coordinates) {
    console.error("Failed to find map monster location");
    return;
  }

  const { x, y } = coordinates!.data[0];

  const { status: statusMovement, cooldown: cooldownMovement } = await movement(
    character,
    { x: x, y: y }
  );

  if (statusMovement === 200) {
    await cooldownDelay(cooldownMovement!.total_seconds);
  }
};
