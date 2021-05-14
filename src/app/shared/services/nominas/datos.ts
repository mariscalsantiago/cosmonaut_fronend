/*         Nómina ordinaria          */
export const ordinariaCalculo = {
  datos: {
    "cantidadEmpleados": 2,
    "nombreNomina": "Nómina Mayo 2021-1",
    "clavePeriodo": "OSS2/2021",
    "fechaInicio": "2021-05-01",
    "fechaFin": "2021-05-31",
    "fechaInicio_incidencias": "2021-05-01",
    "fechaFinIncidencias": "2021-05-31",
    "totalPercepcion": 38545.13,
    "totalDeduccion": 6737.25,
    "total": 31807.88
  }
}
export const ordinariaListaActivos = {
  datos: [
    {
      "nominaOrdinaria": {
        "nombreNomina": "Nómina mensual Mayo 2021",
        "periodo": "OSS5/2021",
        "fechaInicio": "2021-05-01",
        "fechaFin": "2021-05-31",
        "fechaInicio_incidencias": "2021-05-01",
        "fechaFinIncidencias": "2021-05-31",
        "empleados": 2,
        "percepciones": null,
        "deducciones": null,
        "total": null,
        "nominaXperiodoId": 252
      }
    },
    {
      "nominaOrdinaria": {
        "nombreNomina": "Nomina Mayo Nike",
        "periodo": "OSS4/2021",
        "fechaInicio": "2021-05-01",
        "fechaFin": "2021-05-15",
        "fechaInicio_incidencias": "2021-05-01",
        "fechaFinIncidencias": "2021-05-15",
        "empleados": 2,
        "percepciones": null,
        "deducciones": null,
        "total": null,
        "nominaXperiodoId": 249
      }
    },
    {
      "nominaOrdinaria": {
        "nombreNomina": "Nómina Mayo 2",
        "periodo": "OSS3/2021",
        "fechaInicio": "2021-05-16",
        "fechaFin": "2021-05-31",
        "fechaInicio_incidencias": "2021-05-16",
        "fechaFinIncidencias": "2021-05-31",
        "empleados": 1,
        "percepciones": null,
        "deducciones": null,
        "total": null,
        "nominaXperiodoId": 238
      }
    },
    {
      "nominaOrdinaria": {
        "nombreNomina": "Nomina de empleados extemporaneos",
        "periodo": "OSS7/2021",
        "fechaInicio": "2021-05-01",
        "fechaFin": "2021-05-15",
        "fechaInicio_incidencias": "2021-05-01",
        "fechaFinIncidencias": "2021-05-15",
        "empleados": 2,
        "percepciones": null,
        "deducciones": null,
        "total": null,
        "nominaXperiodoId": 304
      }
    },
    {
      "nominaOrdinaria": {
        "nombreNomina": "Nómina quincenal gerentes 1 mayo",
        "periodo": "OSS6/2021",
        "fechaInicio": "2021-05-01",
        "fechaFin": "2021-05-15",
        "fechaInicio_incidencias": "2021-05-01",
        "fechaFinIncidencias": "2021-05-15",
        "empleados": 3,
        "percepciones": 38739.03,
        "deducciones": 6781.96,
        "total": 31957.07,
        "nominaXperiodoId": 262
      }
    },
    {
      "nominaOrdinaria": {
        "nombreNomina": "Nómina Mayo 2021-1",
        "periodo": "OSS2/2021",
        "fechaInicio": "2021-05-01",
        "fechaFin": "2021-05-31",
        "fechaInicio_incidencias": "2021-05-01",
        "fechaFinIncidencias": "2021-05-31",
        "empleados": 2,
        "percepciones": null,
        "deducciones": null,
        "total": null,
        "nominaXperiodoId": 237
      }
    },
    {
      "nominaOrdinaria": {
        "nombreNomina": "Nomina Mayo 1 Starbucks Campeche",
        "periodo": "OSS1/2021",
        "fechaInicio": "2021-05-01",
        "fechaFin": "2021-05-15",
        "fechaInicio_incidencias": "2021-05-01",
        "fechaFinIncidencias": "2021-05-15",
        "empleados": 2,
        "percepciones": 25118.48,
        "deducciones": 4359.56,
        "total": 20758.92,
        "nominaXperiodoId": 229
      }
    }
  ]
}


export const ordinariaUsuariosCalculados = {
  datos: [
    {
      "calculoEmpleado": {
        "empleado": "Georgina López Luna",
        "numeroEmpleado": "STB101",
        "diasLaborados": 15.21,
        "percepciones": 12036.00,
        "deducciones": 2058.66,
        "total": 9977.34,
        "areaId": 184,
        "nominaXperiodoId": 229,
        "fechaContrato": "2020-04-01",
        "personaId": 802,
        "centrocClienteId": 464
      }
    },
    {
      "calculoEmpleado": {
        "empleado": "Rosalba Gómez Gill",
        "numeroEmpleado": "STB102",
        "diasLaborados": 15.21,
        "percepciones": 13082.48,
        "deducciones": 2300.90,
        "total": 10781.58,
        "areaId": 184,
        "nominaXperiodoId": 229,
        "fechaContrato": "2020-02-01",
        "personaId": 803,
        "centrocClienteId": 464
      }
    }
  ]
};


export const ordinariaUsuariosCalculadosDetalle = {
  datos: [
    {
      "detalleNominaEmpleado": {
        "salarioDiario": 756.17,
        "salarioBaseCotizacion": 791.41,
        "impuestoNomina": 230,
        "provisionVacaciones": 189.04,
        "imssPatronal": 2163.69,
        "provisionPrimaVacacional": 47.27,
        "provisionAguinaldo": 472.61,
        "diasLaborados": 15.21,
        "diasPeriodo": 15.21,
        "diasAusencia": 0,
        "diasIncapacidad": 0,
        "diasVacaciones": 0,
        "diasEconomicos": 0,
        "diasFestivoLabor": 0,
        "diasDescansoLabor": 0,
        "diasDescansoLaborDom": 0,
        "percepciones": [
          {
            "concepto": "Sueldos",
            "montoTotal": 12036.00
          },
          {
            "concepto": "Tipo Otros Pagos",
            "montoTotal": 0.00
          }
        ],
        "deducciones": [
          {
            "concepto": "ISR",
            "montoCuota": 1745.37
          },
          {
            "concepto": "IMSS",
            "montoCuota": 313.29
          }
        ]
      }
    }
  ]
};


export const ordinariaUsuariosDispersion = {
  datos: [
    {
      "empleadoApago": {
        "nombreEmpleado": "Georgina",
        "apellidoPatEmpleado": "López",
        "apellidoMatEmpleado": "Luna",
        "banco": null,
        "totalNetoEndinero": 9977.34,
        "tipoPago": "Efectivo",
        "status": "ESTATUS_PAGO"
      }
    },
    {
      "empleadoApago": {
        "nombreEmpleado": "Rosalba",
        "apellidoPatEmpleado": "Gómez",
        "apellidoMatEmpleado": "Gill",
        "banco": null,
        "totalNetoEndinero": 10781.58,
        "tipoPago": "Cheque",
        "status": "ESTATUS_PAGO"
      }
    }
  ]
}


export const ordinariaUsuariosTimbrado = {
  datos: [
    {
      "reciboATimbrar": {
        "nombreEmpleado": "Rosalba",
        "apellidoPatEmpleado": "Gómez",
        "apellidoMatEmpleado": "Gill",
        "tipoPago": "Cheque",
        "totalNeto": 10781.58,
        "fechaPagoTimbrado": "2021-05-14T17:33:00.8758+00:00",
        "status": "Sin Timbrar",
        "fechaContrato": "2020-02-01",
        "personaId": 803
      }
    },
    {
      "reciboATimbrar": {
        "nombreEmpleado": "Georgina",
        "apellidoPatEmpleado": "López",
        "apellidoMatEmpleado": "Luna",
        "tipoPago": "Efectivo",
        "totalNeto": 9977.34,
        "fechaPagoTimbrado": "2021-05-14T17:33:00.8758+00:00",
        "status": "Sin Timbrar",
        "fechaContrato": "2020-04-01",
        "personaId": 802
      }
    }
  ]
}


export const ordinariaUsuariosTimbradoDetalle = {
  datos: [
    {
      "xmlPreliminar": {
        "percepcion": [
          {
            "percepciones": "Sueldos",
            "monto": 13082.48,
            "gravado": 13082.48,
            "exento": 0.00
          },
          {
            "percepciones": "Tipo Otros Pagos",
            "monto": 0.00,
            "gravado": 0.00,
            "exento": 0.00
          }
        ],
        "deduccion": [
          {
            "deducciones": "ISR",
            "monto": 1958.96
          },
          {
            "deducciones": "IMSS",
            "monto": 341.94
          }
        ],
        "totalMontoPercepciones": 13082.48,
        "totalGravado": 13082.48,
        "totalExento": 0,
        "totalMontoDeducciones": 2300.9
      }
    }
  ]
}



/*     NÓMINA EXTRAORDINARIA     */


export const aguinaldoListaActivos = {
  datos: [
    {
      "nominaExtraordinaria": {
        "nombreNomina": "PRueba fin/liq NEW CALC",
        "periodo": "EFL19/2021",
        "fechaInicio": "2021-05-08",
        "fechaFin": "2021-05-08",
        "fechaInicioIncidencias": null,
        "fechaFin_incidencias": null,
        "empleados": 1,
        "percepciones": 0.00,
        "deducciones": 0.00,
        "total": 0.00,
        "nominaXperiodoId": 300
      }
    }]
};


export const aguinaldoCalculo = {
  datos: {
    "nominaXperiodoId": 242,
    "cantidadEmpleados": "3",
    "nombreNomina": "Nomina Extraordinaria Aguinaldo Mayo 4",
    "clavePeriodo": "EAGU1/2021",
    "fechaInicio": "2021-01-01",
    "fechaFin": "2021-12-31",
    "fechaInicio_incidencias": "2021-01-01",
    "fechaFinIncidencias": "2021-12-31",
    "totalPercepcion": 34316.55,
    "totalDeduccion": 2035.45,
    "total": 32281.10,
    "estadoNominaIdActual": "2"
  }
}



export const aguinaldoUsuariosCalculados = {
  datos: [
    {
      "calculoEmpleadoAguinaldo": {
        "empleado": "Rosalba Gómez Gill",
        "id": "STB102",
        "diasLaborados": 365.00,
        "percepciones": 12328.80,
        "deducciones": 776.18,
        "total": 11552.62,
        "areaId": 184,
        "nominaXperiodoId": 242,
        "fechaContrato": "2020-02-01",
        "personaId": 803,
        "centrocClienteId": 464
      }
    },
    {
      "calculoEmpleadoAguinaldo": {
        "empleado": "Fernando Rodríguez Gamboa",
        "id": "STB100",
        "diasLaborados": 365.00,
        "percepciones": 10645.20,
        "deducciones": 591.70,
        "total": 10053.50,
        "areaId": 184,
        "nominaXperiodoId": 242,
        "fechaContrato": "2018-10-03",
        "personaId": 801,
        "centrocClienteId": 464
      }
    },
    {
      "calculoEmpleadoAguinaldo": {
        "empleado": "Georgina López Luna",
        "id": "STB101",
        "diasLaborados": 365.00,
        "percepciones": 11342.55,
        "deducciones": 667.57,
        "total": 10674.98,
        "areaId": 184,
        "nominaXperiodoId": 242,
        "fechaContrato": "2020-04-01",
        "personaId": 802,
        "centrocClienteId": 464
      }
    }
  ]
};

export const aguinaldoUsuariosCalculadosDetalle = {
  datos: [
    {
      "detalleNominaEmpleadoAguinaldo": {
        "salarioDiario": 821.92,
        "salarioBaseCotizacion": 860.22,
        "impuestoNomina": 369.86,
        "provisionVacaciones": 0,
        "imssPatronal": 0,
        "provisionPrimaVacacional": 0,
        "provisionAguinaldo": 0,
        "diasLaborados": 365,
        "diasFestivoLabor": 0,
        "diasDescansoLabor": 0,
        "diasDescansoLaborDom": 0,
        "horasExtraDoble": 0,
        "horasExtraTriple": 0,
        "percepciones": [
          {
            "concepto": "Gratificación Anual (Aguinaldo)",
            "montoTotal": 12328.80
          }
        ],
        "deducciones": [
          {
            "concepto": "ISR",
            "montoCuota": 776.18
          }
        ]
      }
    }
  ]
};

export const aguinaldoUsuariosDispersion = {
  datos: [
    {
      "empleadoApagoAguinaldo": {
        "nombreEmpleado": "Fernando",
        "apellidoPatEmpleado": "Rodríguez",
        "apellidoMatEmpleado": "Gamboa",
        "rfc": "ROAJ821221HO2",
        "banco": "BANORTE/IXE",
        "totalNetoEndinero": 10053.50,
        "tipoPago": "Transferencia",
        "status": "ESTATUS_PAGO"
      }
    },
    {
      "empleadoApagoAguinaldo": {
        "nombreEmpleado": "Georgina",
        "apellidoPatEmpleado": "López",
        "apellidoMatEmpleado": "Luna",
        "rfc": "MABG830302MD9",
        "banco": null,
        "totalNetoEndinero": 10674.98,
        "tipoPago": "Efectivo",
        "status": "ESTATUS_PAGO"
      }
    },
    {
      "empleadoApagoAguinaldo": {
        "nombreEmpleado": "Rosalba",
        "apellidoPatEmpleado": "Gómez",
        "apellidoMatEmpleado": "Gill",
        "rfc": "ROAJ821221MO9",
        "banco": null,
        "totalNetoEndinero": 11552.62,
        "tipoPago": "Cheque",
        "status": "ESTATUS_PAGO"
      }
    }
  ]
}

export const aguinaldoUsuariosTimbrado = {
  "datos": [
    {
      "reciboATimbrarAguinaldo": {
        "nombreEmpleado": "Karla",
        "apellidoPatEmpleado": "Salinas",
        "apellidoMatEmpleado": "Sánchez",
        "tipoPago": "Efectivo",
        "fechaPagoTimbrado": "2021-05-14T03:21:54.723047+00:00",
        "status": "Sin Timbrar",
        "fechaContrato": "2018-10-10",
        "personaId": 819,
        "centrocClienteId": 466
      }
    }
  ],
  "resultado": true,
  "mensaje": "Operación realizada con éxito"
}

export const aguinaldoUsuariosTimbradoDetalle = {
  "datos": [
    {
      "xmlPreliminarAguinaldo": {
        "percepcion": [
          {
            "percepciones": "Gratificación Anual (Aguinaldo)",
            "monto": 12328.8,
            "gravado": 9640.2,
            "exento": 2688.6
          }
        ],
        "deduccion": [
          {
            "deducciones": "ISR",
            "monto": 776.18
          }
        ],
        "totalMontoPercepciones": 12328.8,
        "totalGravado": 9640.2,
        "totalExento": 2688.6,
        "totalMontoDeducciones": 776.18
      }
    }
  ],
  "resultado": true,
  "mensaje": "Operación realizada con éxito"
}





/*          Nómina de finiquito liquidación       */


export const finiquitoListaActivos = {
  datos: [
    {
      "nominaLiquidacion": {
        "nombreNomina": "Finquito/Liquidacion Mayo 1 14-05",
        "periodo": "EFL1/2021",
        "fechaInicio": "2021-05-14",
        "fechaFin": "2021-05-14",
        "fechaInicioIncidencias": null,
        "fechaFin_incidencias": null,
        "empleados": 2,
        "percepciones": 170867.58,
        "deducciones": 35208.57,
        "total": 135659.01,
        "nominaXperiodoId": 314
      }
    }
  ]
}


export const finiquitoUsuariosCalculados = {
  datos: [
    {
      "calculoEmpleadoLiquidacion": {
        "empleado": "Julián Hernández Franz",
        "id": "821",
        "diasLaborados": 13.00,
        "percepciones": 160329.34,
        "deducciones": 34582.95,
        "total": 125746.39,
        "areaId": 189,
        "nominaXperiodoId": 314,
        "fechaContrato": "2017-07-02",
        "personaId": 821,
        "centrocClienteId": 466
      }
    },
    {
      "calculoEmpleadoLiquidacion": {
        "empleado": "Karla Salinas Sánchez",
        "id": "819",
        "diasLaborados": 20.00,
        "percepciones": 10538.24,
        "deducciones": 625.62,
        "total": 9912.62,
        "areaId": 189,
        "nominaXperiodoId": 314,
        "fechaContrato": "2018-10-10",
        "personaId": 819,
        "centrocClienteId": 466
      }
    }
  ]
}

export const finiquitoUsuariosCalculadosDetalle = {
  datos: [
    {
      "detalleNominaEmpleadoLiquidacion": {
        "salarioDiario": 580.65,
        "salarioBaseCotizacion": 609.28,
        "impuestoNomina": 69.93,
        "provisionVacaciones": 0,
        "imssPatronal": 0,
        "provisionPrimaVacacional": 0,
        "provisionAguinaldo": 0,
        "diasLaborados": 1,
        "diasFestivoLabor": 0,
        "diasDescansoLabor": 0,
        "diasDescansoLaborDom": 0,
        "horasExtraDoble": 0,
        "horasExtraTriple": 0,
        "percepciones": [
          {
            "concepto": "Sueldos",
            "montoTotal": 609.28
          },
          {
            "concepto": "Gratificación Anual (Aguinaldo)",
            "montoTotal": 2887.34
          },
          {
            "concepto": "Indemnización 20 días",
            "montoTotal": 47707.46
          },
          {
            "concepto": "Indemnización 20 días",
            "montoTotal": 155049.24
          }
        ],
        "deducciones": [
          {
            "concepto": "ISR",
            "montoCuota": 54882.12
          },
          {
            "concepto": "ISR",
            "montoCuota": 22.84
          }
        ]
      }
    }
  ]
}

export const finiquitoUsuariosDispersion = {
  datos: [
    {
      "empleadoApagoLiquidacion": {
        "nombreEmpleado": "Tania",
        "apellidoPatEmpleado": "Gaytán",
        "apellidoMatEmpleado": "Lomas",
        "banco": "BBVA BANCOMER",
        "totalNetoEndinero": 151348.36,
        "tipoPago": "Transferencia",
        "status": "ESTATUS_PAGO"
      }
    }
  ]
}
export const finiquitoUsuariosTimbrado = {
  datos: [
    {
        "reciboATimbrarLiquidacion": {
            "nombreEmpleado": "Fernando",
            "apellidoPatEmpleado": "Rodríguez",
            "apellidoMatEmpleado": "Gamboa",
            "tipoPago": "Transferencia",
            "totalNeto": 140602.92,
            "fechaPagoTimbrado": "2021-05-14T22:01:51.882006+00:00",
            "status": "Sin Timbrar"
        }
    }
]
}
export const finiquitoUsuariosTimbradoDetalle = {
  datos: [
    {
      "xmlPreliminarLiquidacion": {
        "percepcion": [
          {
            "percepciones": "Sueldos",
            "monto": 10288.33,
            "gravado": 10288.33,
            "exento": 0.00
          },
          {
            "percepciones": "Gratificación Anual (Aguinaldo finiquito)",
            "monto": 4133.04,
            "gravado": 1444.44,
            "exento": 2688.60
          }
        ],
        "deduccion": [
          {
            "deducciones": "ISR",
            "monto": 1121.67
          }
        ],
        "totalMontoPercepciones": 14421.37,
        "totalGravado": 11732.77,
        "totalExento": 2688.6,
        "totalMontoDeducciones": 1121.67
      }
    }
  ]
}

export const finiquitoCalculo = {
  datos: {
    "nominaXperiodoId": 259,
    "cantidadEmpleados": "0",
    "nombreNomina": "Prueba finquito Mayo 1",
    "clavePeriodo": "EFL2/2021",
    "fechaInicio": "2021-05-01",
    "fechaFin": "2021-05-10",
    "fechaInicio_incidencias": "2021-05-01",
    "fechaFinIncidencias": "2021-05-10",
    "totalPercepcion": 21846.58,
    "totalDeduccion": 1243.92,
    "total": 20602.66,
    "estadoNominaIdActual": "2"
  },
}

