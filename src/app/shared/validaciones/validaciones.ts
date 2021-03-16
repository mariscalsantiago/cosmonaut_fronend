import { FormControl, ValidationErrors } from "@angular/forms";

export class validacionesForms{
  
    public static  nssValido(control:FormControl) {
        let nss = control.value;

        let noaplica = null;
        console.log(nss);

        if(nss == null){
            return noaplica;
        }else if(nss.trim() == ''){
            return noaplica;
        }

        const re       = /^(\d{2})(\d{2})(\d{2})\d{5}$/,
              validado = nss.match(re);

            
        if (!validado) 
            return {nssValido:true};
            
        const subDeleg = parseInt(validado[1],10),
              anno     = new Date().getFullYear() % 100;
        let   annoAlta = parseInt(validado[2],10),
              annoNac  = parseInt(validado[3],10);
        
        if (subDeleg != 97) {
            if (annoAlta <= anno) annoAlta += 100;
            if (annoNac  <= anno) annoNac  += 100;
            if (annoNac  >  annoAlta)
                return {
                    nnsValido:true
                }; 
        }
        
        let resultado = validacionesForms.luhn(nss);
        console.log("Es valido el numero",resultado);

        

        return resultado==true ? null: {nnsValido:true};
    }

    private static  luhn(nss:any) {
        let suma   = 0,
            par    = false,
            digito;
        
        for (let i = nss.length - 1; i >= 0; i--) {
             digito = parseInt(nss.charAt(i),10);
            if (par)
                if ((digito *= 2) > 9)
                    digito -= 9;
            
            par = !par;
            suma += digito;
        }
        return (suma % 10) == 0;
    }
}