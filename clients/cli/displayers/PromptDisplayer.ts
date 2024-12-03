import chalk from "chalk";

export class PromptDisplayer{
    showHelp(choides:{name:string,description:string}[]):string{
        let help=`${chalk.greenBright("\n\tHappy cast !!!\n\n")}`;
        for (let i = 0; i < choides.length; i++) {
            const choice = choides[i];
            help = help.concat(`[${chalk.green(choice.name)}]: ${choice.description}`,"\n")
        }
        return help;
        
    }
}