class Search{
    private name:string | null=null;


    public getName():string | null{
        return this.name;
    }
    
    public setName(name:string|null):Search{
        this.name = name;

        return this;
    }
}