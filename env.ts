import dotenv from "dotenv";
import { z } from "zod";
import chalk from "chalk";
import boxen from "boxen";

dotenv.config();

// Define environment schema
const envSchema = z.object({
  BASE_URL: z.string().url(),
  TOKEN: z.string(),
  CHARACTER: z.string(),
  CHARACTER_ONE: z.string(),
  CHARACTER_TWO: z.string(),
  CHARACTER_THREE: z.string(),
  CHARACTER_FOUR: z.string(),
  ACCOUNT_NAME: z.string(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Validate environment variables
const envValidated = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  TOKEN: process.env.TOKEN,
  CHARACTER: process.env.CHARACTER,
  CHARACTER_ONE: process.env.CHARACTER_ONE,
  CHARACTER_TWO: process.env.CHARACTER_TWO,
  CHARACTER_THREE: process.env.CHARACTER_THREE,
  CHARACTER_FOUR: process.env.CHARACTER_FOUR,
  ACCOUNT_NAME: process.env.ACCOUNT_NAME,
  BASE_URL: process.env.BASE_URL,
});

if (!envValidated.success) {
  console.error(
    boxen(
      chalk.red("❌ Missing or Invalid Env:\n") +
        envValidated.error.issues
          .map(
            (err) =>
              `${chalk.yellow(err.path.join("."))}: ${chalk.red(err.message)}`
          )
          .join("\n"),
      { padding: 1, borderColor: "red", borderStyle: "round" }
    )
  );

  process.exit(1);
}

// Export validated env
export const env = envValidated.data;
