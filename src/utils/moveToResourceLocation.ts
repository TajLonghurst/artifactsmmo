import { movement } from "../api/actions";
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
    querys: { drop: drop },
  });

  if (statusResource !== 200) {
    console.log("Failed to find resource drop");
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

// I give resource code e.g copper_ore
// Its searches api GET /resources/?drop={paramsCode} gives code "copper_rocks"
// Cooldown wait on api
// using "copper_rocks" searches api GET /maps?code={paramCode} get x and y cords
// Cooldown wait on api
// Move to location of rocks

//   console.log(location?.data[0].x, location?.data[0].y);
