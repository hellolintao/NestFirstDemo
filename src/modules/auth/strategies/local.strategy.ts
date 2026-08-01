import { Strategy } from 'passport-local'; // 注意这里的Strategy来源于passport-local
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super();
  }

  // 本地验证通过后
  async validate(username: string, password: string): Promise<User> {
    // 打印日志
    this.logger.debug(`LocalStrategy: Validating user: ${username}`);

    // 使用本地验证服务进行验证
    const user = await this.authService.verifyCredentials({ username, password });

    // 如果没有用户存在，异常
    if (!user) {
      this.logger.warn(`LocalStrategy: Invalid credentials for user: ${username}`);
      throw new UnauthorizedException();
    }
    this.logger.debug(`LocalStrategy: Successfully validated user: ${username}`);

    // 返回验证过后的用户
    return user;
  }
}
