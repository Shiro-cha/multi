import { Idenity } from "../../entity/Idenity";
import { IContext } from "../../types/IContext";
import { FileFactory } from "./Factory";

export class FileContext  implements IContext{
    search(content: any): string[] {
        const fileSearcher = FileFactory.create("local");
        const matchs:string[] = fileSearcher?.scan(content) as string[];
        return matchs;
    }
}