import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Récupère les rôles requis définis via le décorateur @Roles() sur la route ou le contrôleur
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        // S'il n'y a pas de décorateur @Roles(), la route est libre d'accès pour toute personne authentifiée.
        if (!requiredRoles) {
            return true;
        }

        // Récupère l'utilisateur injecté par le JwtAuthGuard
        const { user } = context.switchToHttp().getRequest();

        // Vérifie si le rôle de l'utilisateur fait partie des rôles requis
        return requiredRoles.some((role) => user.role?.includes(role));
    }
}
