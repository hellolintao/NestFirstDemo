import { ExtractJwt, Strategy } from 'passport-jwt'; // 注意这里的Strategy来源于passport-jwt
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // 日志记录
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头Authorization: Bearer <token>中提取jwt
      ignoreExpiration: false, // 忽略过期检查（返回401）
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'), // 密钥
    });
  }

  // 验证通过后，这个方法会被调用，返回值会挂在到req.user
  validate(payload: JwtPayloadDto): JwtPayloadDto {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    // Here you could add additional validation or fetch user details if needed
    return payload; // 返回的对象自动挂载到req.user
  }
}
