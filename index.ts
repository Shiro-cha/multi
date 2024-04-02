import { config } from "dotenv";
import { System } from "./facades/System";

config();
const system = new System();

system.init();



