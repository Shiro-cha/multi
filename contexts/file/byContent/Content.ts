
import { AbstractFileContext } from "../AbstractFileContext";

export class Content extends AbstractFileContext{
    match(dir:string): boolean {
        return false;
    }
}