import { movement, gathering, crafting } from "./api/actions/index.ts";
import map from "./api/map/map.ts";

const index = () => {
  const MineCopperOre = async () => {
    let currentCooldown: number;

    const { status, cooldown, character } = await gathering();
    currentCooldown = cooldown!.total_seconds;
    console.log("Collect Ore", status);

    const totalItems = character?.inventory.reduce(
      (total, item) => total + item.quantity,
      0
    );

    if (totalItems === 100) {
      console.log("MAX inv");
      return;
    }

    if (status === 200) {
      setTimeout(index, currentCooldown * 1000);
    }
  };

  MineCopperOre();
};

index();

// const processGameActions = async () => {
//   // 1️⃣ Gathering
//   console.log("Starting gathering...");
//   const { status: gatherStatus, cooldown: gatherCooldown } = await gathering();

//   if (gatherStatus) {
//     console.log(
//       `Waiting ${gatherCooldown!.total_seconds} seconds after gathering...`
//     );
//     await new Promise((resolve) =>
//       setTimeout(resolve, gatherCooldown!.total_seconds * 1000)
//     );
//   }

//   // 2️⃣ Moving
//   console.log("Starting movement...");
//   const { status: moveStatus, cooldown: moveCooldown } = await movement(1, 5);

//   if (moveStatus) {
//     console.log(
//       `Waiting ${moveCooldown!.total_seconds} seconds after moving...`
//     );
//     await new Promise((resolve) =>
//       setTimeout(resolve, moveCooldown!.total_seconds * 1000)
//     );
//   }

//   // 3️⃣ Crafting
//   console.log("Starting crafting...");
//   const { status: craftStatus, cooldown: craftCooldown } = await craft();

//   if (craftStatus) {
//     console.log(
//       `Waiting ${craftCooldown!.total_seconds} seconds after crafting...`
//     );
//     await new Promise((resolve) =>
//       setTimeout(resolve, craftCooldown!.total_seconds * 1000)
//     );
//   }

//   console.log("All actions completed!");
// };

// // Run the function
// processGameActions();
