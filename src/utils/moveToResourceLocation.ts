import { movement } from "../api/actions";
import Items from "../api/items/items";
import map from "../api/map/map";
import resources from "../api/resources/ resources";
import { ResourceDrops } from "../types/types";
import { cooldownDelay } from "./cooldownDelay";

interface IMoveToResourceLocation {
  character: string;
  query: {
    drop: ResourceDrops;
  };
}

export const moveToResourceLocation = async ({
  character,
  query,
}: IMoveToResourceLocation) => {
  const { drop } = query;

  const { data, status: statusResource } = await resources({
    querys: { code: drop },
  });

  if (statusResource !== 200) {
    console.log("Failed to find resource code");
    return;
  }

  const location = data?.data?.[0].code;

  const coordinates = await map({ querys: { content_code: location } });

  if (!coordinates) {
    console.error("Failed to find map resource location");
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
