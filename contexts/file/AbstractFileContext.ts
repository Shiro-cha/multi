import { readdirSync, statSync } from "fs";
import { IFileContext } from "../../types/IFileContext";
import { userInfo } from "os";
import { join } from "path";

export abstract class AbstractFileContext implements IFileContext{

    abstract match(dir:string,criteria:any):boolean;

    scan(criteria:any,userHome:string = userInfo().homedir): string[] {
        const dirs = readdirSync(userHome);
        const matchs:string[] = [];
        dirs.forEach((dir)=>{
            const fullpath = join(userHome,dir)
            if(!this.isHidden(dir) && this.match(fullpath,criteria)){
                matchs.push(fullpath);
            };
            if(this.isValidDir(fullpath) && !this.isHidden(dir)){
                matchs.push(...this.scan(criteria,fullpath));
            }
        });
        return matchs;
    }

    private isValidDir(dir:string){
        const exceptions = ["node_modules","vendor",".git"]
        const isDirectory = statSync(dir).isDirectory();
        let includeExceptions = false;
        exceptions.forEach((exception)=>{
            if(dir.includes(exception)){
                includeExceptions = true;
            }
        })
        return isDirectory && !includeExceptions
    }
    private isHidden(dir:string){
        return dir.charAt(0) == '.';
    }
}