import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  try{
    const token = auth.getToken();

    if(token){
      return true
    } else {
      router.navigate(['/login'])
      return false
    }
  } catch(error){
    console.log(error)
    router.navigate(['/login'])
    return false
  }
  
};
