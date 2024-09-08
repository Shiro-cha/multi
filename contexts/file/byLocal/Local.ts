import { extname } from "path";
import { AbstractFileContext } from "../AbstractFileContext";

export class Local extends AbstractFileContext{
    match(dir:string,criteria:{keys:string[],extension:string}): boolean {
        let isValid = true;
        
        if(!this.includeKeys(criteria.keys,dir)){
            return false;
        }
        if(!this.includeExtension(criteria.extension,dir)){
            return false;
        }
        return true;
    }
    private includeKeys(keys:string[],pathname:string){
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const includeAll = pathname.toLocaleLowerCase().includes(key.toLocaleLowerCase());
            if(!includeAll){
                return false;
            }
            
        }
        return true;
    }
    private includeExtension(extension:string,pathname:string){
        const pathextname = extname(pathname);
        return pathextname === extension;
    }
}