import { IContext } from "../types/IContext";
import { FileContext } from "./file/FileContext";

export class Factory{
    static create(contextType:string):IContext | null{
        switch (contextType) {
            case "file":
                return new FileContext();
            default:
                return null;
        }
    }
}