import prompts from "prompts"
import chalk from "chalk";
import { System } from "../../../facades/System";
import { PromptDisplayer } from "../displayers/PromptDisplayer";
import { router } from "../prompt_routers/route";
import { choices ,questions} from "../config/prompt";
import { Logger } from "./Logger";
import { AppEvent } from "../../../core/AppEvent";

export class Main{
    async start():Promise<void>{
        const system = new System();
        const displayer = new PromptDisplayer();
        const logger  = Logger.create();
        await system.init();
        let lastaction = "";
        let code = 0;
        AppEvent.create().on("found").then(function(){
            console.log("foundddddddd");
        })
        while (true) {
          const help = displayer.showHelp(choices); 
          lastaction ? Main.displayHeader(lastaction,code):null;
          logger.append(help);    
          const response = await prompts(questions) as {choice:string};
          code = await router.triggerEvent(response.choice);
          lastaction = response.choice;
        }
        
    }
    static verifyChoice(choices:{name:string,description:string}[],choice:string){
        return choices.map(choice=>choice.name).includes(choice)
    }
    static displayHeader(lastaction:string,code:number){
        const logger  = Logger.create();
        if(code > 0){
            logger.log(chalk.redBright(`\tx action [${chalk.blueBright(lastaction)}] does not success`))
        }else{
            logger.log(chalk.greenBright(`\t✔ your last action was [${chalk.blueBright(lastaction)}]`))
        }
        console.log(lastaction);
        
    }
}