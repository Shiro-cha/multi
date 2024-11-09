import { IFileContext } from "../../types/IFileContext";
import { Content } from "./byContent/Content";
import { Local } from "./byLocal/Local";

export class FileFactory{
    static create(searchFileType:string):IFileContext | null{
        switch (searchFileType) {
            case "local":
                return new Local();
            case "content":
                return new Content();
            break;
            default:
                return null
        }

    }
}