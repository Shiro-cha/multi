import { exit } from "process";
import prompts from "prompts"
import chalk from "chalk";
import { Logger } from "../core/Logger";
import { edits, infos as confinfos, news, renews, deletions, delete_nothing} from "../config/prompt";
import { IdentityFacade } from "../../../facades/Idenity";
import { SearchFacade } from "../../../facades/Search";
import { Search } from "../../../entity/Search";

export class CLIController{
    private  static logger:Logger = Logger.create();
    
    async edit(data:any){
        CLIController.logger.log(chalk.underline.blue("\tEditing\n"));
        const response = await prompts(edits) as {username:string,confirmation:boolean};
        if(response.confirmation){
            const identity = new IdentityFacade();
            identity.update(response.username)
        }
        return 0;
    }
    async create(){
        try {
            CLIController.logger.log(chalk.underline.blue("\tCreate search request\n"));
            const inputs = await prompts(news) as {name:string,keys:string[],extension:string,confirmation:boolean};
            const search = new SearchFacade();
    
            search.create({name:inputs.name,content:[{keys:[...inputs.keys],extension:inputs.extension}]})
            return 0;
        } catch (error) {
            return 1;
        }
    }
    async resend(){
        try {
            const inputs = await prompts(renews) as {confirmation:string};
            const search = new SearchFacade();
            
            if(inputs.confirmation){
                search.resend();
            }
            return 0;
        } catch (error) {
            return 1;
        }
        
    }
    async remove(){
        try {
            CLIController.logger.log(chalk.underline.blue("\tDelete a search request\n"));
            const search = new SearchFacade();
            const searchs = search.getAll().map((value)=>{return {name:value.getname() as string,value:value.getslug()}});
            if(searchs.length===0){
                await CLIController.onDeleteNothing()
                return 0;
            }
            const config = deletions(searchs);

            
            const inputs = await prompts(config) as {slug:string,cfm:boolean};
            if(inputs.cfm){
                search.delete(inputs.slug);
            }
            return 0;
        } catch (error) {
            return 1;
        }
    }

    async info(){

        try {
            CLIController.logger.log(chalk.underline.blue("\tInformations\n"));
            const identity = new IdentityFacade();
            const infos = identity.get();
            CLIController.logger.append(`
            ${chalk.bold.bgBlue.whiteBright(" Name ")}: ${chalk.blueBright(infos.getname())}
            ${chalk.bold.bgGray.whiteBright(" IP address ")}: ${chalk.whiteBright(infos.getipv4())}
            ${chalk.bold.bgMagenta.whiteBright(" MAC address ")}: ${chalk.magentaBright(infos.getphysicalAddress())}`);
            const back = await prompts(confinfos) as {wanna_quit:string};
            return 0;
        } catch (error) {
            return 1;
        }

    }
    async showAllSearch(){
        CLIController.logger.log(chalk.underline.blue("\tAll search query\n"));
        const searchs = new SearchFacade().getAll();
        if(searchs.length===0){
            CLIController.logger.append(chalk.redBright("\n\t\tNothing to show\n"));
        }
        CLIController.displayAllSearch(searchs);
        const back = await prompts(confinfos) as {wanna_quit:string};
        return 0;
    }

    async quit(){
        CLIController.logger.append(chalk.cyanBright("\nPeace ;) \n"));
        exit(0);
        return 0;
    }
    static async onDeleteNothing(){
        CLIController.logger.append(chalk.redBright("\t\tNothing to delete\n"));
        await prompts(delete_nothing) as {wanna_quit:string};
    }
    static displayAllSearch(searchs:Search[]){
        searchs.forEach((search)=>{
            CLIController.logger.append(`\n\t ${chalk.italic.blueBright(search.getname())} (${search.getfounders().length } result(s)) - ${chalk.gray(search.slug)}`)
        })
        CLIController.logger.append("\n")
    }
}