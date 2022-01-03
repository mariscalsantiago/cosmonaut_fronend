// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  rutaEmpresa:'/empresas',
  rutaCatalogos:'/catalogos',
  rutaNomina:'/nomina',
  //rutaNomina:'http://8750-2806-107e-20-3c25-2d18-86ba-692d-175a.ngrok.io',
  rutaAdmin: 'http://192.168.0.33:8080',
  //rutaAdmin: '/admin',
  rutaReportes:'/reportes',
  rutaSocket:'wss://cosmonautdev.wintermute.services/empresa',
  //rutaSocket:'ws://192.168.1.67:8080'
  rutaEvents:'/webevent',
  mensaje:"Es DEFECTO"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
