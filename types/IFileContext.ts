export interface IFileContext{
    match(dir:string,criteria:any):boolean;
    scan(criteria:any,home?:string):string[];
}