// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//* firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDzg54DuBLYAAhlUdTZSiLtgkfxBBcFAts",
  authDomain: "dps-desafio2-82080.firebaseapp.com",
  databaseURL: "https://dps-desafio2-82080.firebaseio.com",
  projectId: "dps-desafio2-82080",
  storageBucket: "dps-desafio2-82080.appspot.com",
  messagingSenderId: "432777185787",
  appId: "1:432777185787:web:c276a042cde23fed6c635e"
}

export const environment = {
  production: false,
  firebaseConfig,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
