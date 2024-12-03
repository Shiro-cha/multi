import Event from "events";
export class AppEvent{
    private evt:Event;
    private static instance = null;
    private constructor(){
        this.evt = new Event();
    }

    emit(eventName:string){
        this.evt.emit(eventName);
    }
    async on(eventName:string){
        return new Promise((resolve)=>{
            this.evt.on(eventName,resolve);
        })
    }

    static create(){
        return AppEvent.instance===null ? new AppEvent():AppEvent.instance;
    }
}