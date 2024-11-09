import { program } from "commander";
import { Main } from "./core/Main";


program
.description("This program start the Ar-multicast app")

.command("start")
.description("Start Ar-multicast system")
.action(new Main().start);

program.parse();