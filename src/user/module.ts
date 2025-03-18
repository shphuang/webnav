import { Module, TokenInjector } from '@danet/core';
import { UserController } from './controller.ts';
import { UserService } from './service.ts';
import { USER_REPOSITORY } from './constant.ts';
import { UserRepository } from './repository.ts';

@Module({
  controllers: [UserController],
  injectables: [
    new TokenInjector(UserRepository, USER_REPOSITORY),
    UserService,
  ],
})
export class UserModule {}
