import fs from "fs";
import { Service } from "typedi";

@Service()
export class LocalService{
 constructor(
    private filePath:string= (process.env.DATABASE_PATH as string)
 ){
   
 }

 getFilePath():string{
    return this.filePath;
 }

 read():string{
    const fileContent = fs.readFileSync(this.filePath);
    return fileContent.toString();
 }
 write(data:any):void{
   try {
      fs.writeFileSync(this.filePath,JSON.stringify(data));
      
   } catch (error) {
      console.error(error);
      
   }
    
 }
 delete():void{
    fs.rmSync(this.filePath);
 }
}
