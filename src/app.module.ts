import { Module } from '@danet/core';
import { TodoModule } from './todo/module.ts';
import { AppController } from './app.controller.ts';
import { CategoryModule } from './category/module.ts';
import { SiteModule } from './site/module.ts';
import { UserModule } from './user/module.ts';

@Module({
  controllers: [AppController],
  imports: [TodoModule, CategoryModule, SiteModule, UserModule],
})
export class AppModule {}
