import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const currentPath = window.location.pathname;

  const excludedRoutes = ['/cart', '/order-list'];
  const shouldSkip = excludedRoutes.some(path => currentPath.startsWith(path));

  const loader = document.getElementById('global-loader');
  if (!shouldSkip) {
    loader?.style.setProperty('display', 'flex');
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkip) {
        loader?.style.setProperty('display', 'none');
      }
    })
  );
};