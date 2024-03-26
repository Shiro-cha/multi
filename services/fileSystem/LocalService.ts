import fs from "fs";
import { Service } from "typedi";

@Service()
export class LocalService{
 constructor(
    private filePath:string
 ){}

 getFilePath():string{
    return this.filePath;
 }

 read():string{
    const fileContent = fs.readFileSync(this.filePath);
    return fileContent.toString();
 }
 write(data:any):void{
    fs.writeFileSync(this.filePath,JSON.stringify(data));
 }
 delete():void{
    fs.rmSync(this.filePath);
 }
}
