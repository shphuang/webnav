import { Module } from '@danet/core';
import { TodoModule } from './todo/module.ts';
import { AppController } from './app.controller.ts';
import { CategoryModule } from './category/module.ts';

@Module({
  controllers: [AppController],
  imports: [TodoModule, CategoryModule],
})
export class AppModule {}
