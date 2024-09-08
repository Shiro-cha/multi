import { NetworkInterfaceInfo, networkInterfaces } from "os";

export class Network{
    getInterfaces():string[]{
        const interfaces =  Object.keys(networkInterfaces()).filter((name: string) =>name!=="lo");
        return interfaces
    }
    

    getIpv4Info(name:string):NetworkInterfaceInfo | null{
        return this.getIpInfo("IPv4",name);
    }

    getIpv6Info(name:string):NetworkInterfaceInfo | null{
        return this.getIpInfo("IPv6",name);
    }

    private getIpInfo(family:"IPv4"|"IPv6",name:string):NetworkInterfaceInfo | null{
        const interfaceByName = networkInterfaces()[name];

        if(Array.isArray(interfaceByName) && interfaceByName.length > 0){
            return interfaceByName.filter((value: NetworkInterfaceInfo,) => value.family===family)[0];
        }
        return null;
    }
}