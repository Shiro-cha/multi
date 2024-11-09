export class ChatController{
    newChat(req:any){
        const {data} = req;
        console.log("chat",data.discussion);
        
    }
}