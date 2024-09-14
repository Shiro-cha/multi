export class Logger{
    private content!: string;
    private static instance:Logger;
    private constructor(){
        this.content = "";
    }
    log(content:string=""):void{
        this.clear();
        this.content = content;
        this.display(this.content);

    }

    append(line:string=""):void{
        this.clear();
        this.content = this.content.concat("\n",line);
        this.display(this.content);
        
    }
    
    public get getContent() : string {
        return this.content;
    }
    private clear(){
        console.clear();
    }
    private display(content:string){
        console.log(content);
    }

    static create(){
        if(Logger.instance){
            return Logger.instance;
        }
        Logger.instance = new Logger();
        console.log("Logger.instance",Logger.instance);
        

        return Logger.instance;
    }
}