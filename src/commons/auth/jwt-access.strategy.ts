import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

//PassportStrategy(인증 방식, 이름)
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  //NestJS Docs
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Request Header에서 알아서 추출함
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  //검증 성공 시 실행, 실패 시는 에러
  // ### Passport는 validate에 성공할시 리턴값을 request.user에 저장함!!! ###
  validate(payload) {
    console.log('액세스 토큰 검증', payload);
    return {
      user_id: payload.user_id,
      nickname: payload.nickname,
    };
  }
}
