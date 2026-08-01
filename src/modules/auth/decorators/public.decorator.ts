import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 这个装饰器用来声明哪个路由是公共的，即isPublic = true
 * Decorator to mark a route or controller as public (no authentication required).
 * Routes or controllers decorated with @Public() will bypass the JwtAuthGuard.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
