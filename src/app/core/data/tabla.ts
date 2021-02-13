export class tabla{

    public id:any;
    public nombre:any;
    public esId:boolean = false;
    public eventoclick:boolean = false;


    constructor(id:string,nombre:string,esId:boolean = false,eventoclick=false){

        this.id = id;
        this.nombre = nombre;
        this.esId = esId;
        this.eventoclick = eventoclick;

    }

}