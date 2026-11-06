import "dotenv/config";
import { envSchema } from "./env.schema.js";

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const fields = [...new Set(result.error.issues.map((issue) => issue.path.join(".")))];
  // Report field names only: connection strings can contain credentials.
  throw new Error(`Invalid environment configuration: ${fields.join(", ")}`);
}

export const env = result.data;
