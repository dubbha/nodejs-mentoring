import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LoggerService } from 'core/services';
import { User } from 'users/entities';
import { LocalAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { Public } from './decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: LoggerService) {
    logger.setContext(this.constructor.name);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: User }) {
    try {
      return this.authService.login(req.user);
    } catch (e) {
      this.logger.controllerMethodError(e, 'POST /', [req.user]);
    }
  }
}
