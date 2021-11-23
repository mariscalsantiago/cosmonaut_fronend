import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltip'
})
export class TooltipPipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'curp') {
      return  "Clave Única de Registro de Población (CURP).\nClave alfanumérica de 18 caracteres.";
    } else if (value === 'curpRazon') {
      return "A través de esta clave alfanumérica de 13 caracteres, el SAT puede identificar quién pagó los ingresos que recibieron los empleados.";
    } else if (value === 'rfcFisica') {
      return "Registro Federal de Contribuyentes.\nClave alfanumérica de 13 caracteres para personas físcas"
    }else if (value === 'rfc') {
      return "Registro Federal de Contribuyentes.\nClave alfanumérica de 13 caracteres para personas físcas y 12 caracteres para personas morales."
    }else if (value === 'registroPatronal') {
      return "Clave alfanumérica de 11 dígitos asiganda a la empresa cuando se inscribe como patrón de empleados ante el IMSS."
    }else if (value === 'primaRiesgo') {
      return "Factor de pago para cobertura de posibles riesgos derivados por las actividades de la empresa."
    } else if (value === 'imssObrero') {
      return "En caso de que el empleado tenga sueldo mínimo, la cuota obrera es absorbida en la cuota patronal."
    } else if (value === 'numInfo') {
      return "Datos numéricos requeridos por algunos bancos (por ejemplo: en Bancomer, se llama \"número de contrato de nómina\"; en Banorte, es \"número de emisor\"; en Banamex, es \"número de identificación de cliente\")."
    } else if (value === 'clabe') {
        return"Clave númérica de 18 dígitos que identifica de forma única e irrepetible cada cuenta bancaria en la realización de transferencias interbancarias."
    }    else if (value === 'numSucursal') {
      return "Clave de la sucursal bancaria donde se aperturó la cuenta de cargo o abono."
    }
    else if(value === 'calcularISR'){
      return "Recuerda, existe otra opción para calcular el ISR del aguinaldo ¿Quieres utilizar el método del artículo 174 para calcular el ISR del aguinaldo?";
    }
    else if(value === 'calculosConBase'){
      return "Selecciona la opción sobre la cual desesas basar los cálculos de nómina considerando el impacto en parámetros como sueldo base, aguinaldo, vacaciones, etc";
    }
    else if(value === 'politica'){
      return "Al crear tu política nómbrala de manera estándar.";
    }

    else if(value === 'seguroSocial'){
      return "Clave numérica de 11 dígitos asignada de forma única e intransferible a cada trabajador incorporado ante el IMSS.";
    }
    else if(value === 'area'){
      return "Área de adscripción del trabajador, da clic en (+) para agregar un nuevo puesto.";
    }
    else if(value === 'puesto'){
      return "Puesto del trabajador, da clic en  (+) para agregar un nuevo puesto.";
    }
    else if(value === 'jefe'){
      return "Nombre del superior jerárquico inmediato a quien el trabajador reporta sus actividades.";
    }    else if(value === 'entidad'){
      return "Entidad federativa a la que el patrón pagará el impuesto causado por la remuneración de las actividades realizadas por el trabajador a su favor.";
    }
    else if(value === 'politicas'){
      return "Condiciones estipuladas por la empresa para la contratación y pago al trabajador, puedes modificarlas a través del menú Administración de empresa -> Configuración de empresa -> Adminitración políticas.";
    }
    else if(value === 'fechaAntiguedad'){
      return "Fecha de ingreso a la empresa, afecta el pago de prima vacacional, prima de antigüedad y cálculos de liquidación.";
    }
    else if(value === 'tipoContrato'){
      return "El tipo de contrato afecta al recibo de timbrado, finquitos, las percepciones y deducciones.";
    }
    else if(value === 'fechaIngreso'){
      return "Fecha de incorporación del empleado al registro patronal de la empresa ante el IMSS, afecta al cálculo de aguinaldo, finiquito, liquidacion, etc.\nTambién se utilizará para identificar el aniversario del empleado.";
    }
    else if(value === 'jornada'){
      return "Cantidad de tiempo que el trabajador desempeña las actividades para las que fue contratado.";
    }
    else if(value === 'areaGeografica'){
      return "Referencia geográfica para determinar los parámetros del salario mínimo y el sueldo base de cotización del trabajador.";
    }
    else if(value === 'grupoNomina'){
      return "Nombre de la nómina a la que pertenece el trabajador.";
    }
    else if(value === 'sueldoBrutoMensual'){
      return "Salario mensual del empleado considerando todas las percepciones y todas las deducciones (incluye impuestos).";
    }
    else if(value === 'diasVacaciones'){
      return "Indica el saldo de vacaciones que sus empleados no disfrutaron independientemente de sus vacaciones por ley acorde a su política.";
    }
    else if(value === 'metodoPago'){
      return "Medio a través del cual el colaborador recibe su salario, se identifica en el recibo de nómina timbrado.";
    }
    else if(value === 'idCliente'){
      return "Dato númerico requerido por algunos bancos (por ejemplo: en Bancomer, se llama \"número de contrato de nómina\"; en Banorte, es \"número de emisor\"; en Banamex, es \"número de identificación de cliente\").";
    }
    else if(value === 'percepciones'){
      return "Conceptos por los cuáles el empleado recibe un ingreso acumulable a su salario.";
    }
    else if(value === 'deducciones'){
      return "Conceptos por los cuáles el empleado recibe un descuento aplicable sobre salario.";
    }
    else if(value === 'salarioNetoMensual'){
      return "Salario mensual que recibe el empleado resultado de descontar todas las deducciones (incluyendo impuestos) de todas las percepciones.";
    }
    else if(value === 'politicaCaluladora'){
      return "Condiciones estipuladas por la empresa para la contratación y pago al trabajador, puedes modificarlas a través del menú Configuración -> Políticas.";
    }else if(value === 'bimestre'){
      return "Periodo sobre el cual se calcula el promedio de las percepciones variables del trabajador para la actualización del salario diario integrado.";
    }else if(value === 'dias'){
      return "Número de días sobre los cuales se calcula el promedio de las percepciones variables del trabajador para la actualización del salario diario integrado.";
    } else if(value === 'fechaFinNomina'){
      return "No existen nóminas registradas para el empleado en Cosmonaut. Coloca la fecha fin de la última nómina pagada al empleado para que el sistema pueda realizar el cálculo con base a esa fecha.";
    } else if(value === 'editarUsuario'){
      return "Editar";
    } else if(value === 'resetPass'){
      return "Resetear contraseña";
    }else if(value =='contactoinicial'){
        return "Para desactivar a este usuario es necesario hacerlo desde el módulo de Administración de usuarios.";
    }
   
    return '';
  }

}
