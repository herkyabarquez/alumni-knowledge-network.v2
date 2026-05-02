import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isValid = await super.canActivate(context);
    if (!isValid) return false;

    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findOne(request.user.id);

    // If user is not in DB yet, they can't be banned. 
    // They will be synced later in the controller/auth flow.
    if (user && user.isBanned) {
      throw new ForbiddenException('Your account has been banned');
    }

    return true;
  }
}
