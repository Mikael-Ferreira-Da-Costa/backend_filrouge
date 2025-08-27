import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("PORT from .env:", process.env.PORT);
export const SECRET_KEY = process.env.JWT_SECRET;
