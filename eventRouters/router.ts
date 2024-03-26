import { EventRouter } from "../event/RouterEvent";

const router = new EventRouter();

router.addRoute("/",function(){
    console.log("Hello world");
    
})

export {
    router
}