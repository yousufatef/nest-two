import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { CURRENT_USER_KEY } from "../../utils/constants";
import { Reflector } from "@nestjs/core";
import { UserType } from "../../utils/enums";
import { UsersService } from "../users.service";

@Injectable()

export class AuthRoleGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly reflector: Reflector,
        private readonly userService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext) {

        const roles: UserType[] = this.reflector.getAllAndOverride("roles", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!roles || roles.length === 0) {
            throw new UnauthorizedException("Access denied, no roles defined for this route");
        }

        const request: Request = context.switchToHttp().getRequest()
        const [type, token] = request.headers.authorization?.split(' ') || [];
        if (token && type === 'Bearer') {
            try {
                const payload = this.jwtService.verify(token, {
                    secret: this.config.get<string>('JWT_SECRET'),
                });

                const user = await this.userService.getCurrentUser(payload.id);

                if (!user) return false;

                if (roles.includes(user.userType)) {
                    request[CURRENT_USER_KEY] = payload;
                    return true;
                }

            } catch (error) {
                throw new UnauthorizedException("Access denied, invalid token")
            }
        } else {
            throw new UnauthorizedException("Access denied, no token provided")
        }
        return false;
    }

}