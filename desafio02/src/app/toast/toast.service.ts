import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() {
    // @ts-ignore
    toastr.options.positionClass = 'toast-top-left'
    // @ts-ignore
    toastr.options.preventDuplicates = true
  }

  show(msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
    // @ts-ignore
    toastr[type](msg)
  }
}
