export class tabla{

    public id:any;
    public nombre:any;
    public esId:boolean = false;
    public eventoclick:boolean = false;
    public centrar:boolean = false;


    constructor(id:string,nombre:string,esId:boolean = false,eventoclick:boolean=false,centrar:boolean=false){

        this.id = id;
        this.nombre = nombre;
        this.esId = esId;
        this.eventoclick = eventoclick;
        this.centrar = centrar;

    }

}