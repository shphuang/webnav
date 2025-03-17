import { CATEGORY_REPOSITORY } from './constant.ts';
import { CategoryController } from './controller.ts';
import { CategoryRepository } from './repository.ts';
import { CategoryService } from './service.ts';
import { Module, TokenInjector } from '@danet/core';

@Module({
  controllers: [CategoryController],
  injectables: [
    new TokenInjector(CategoryRepository, CATEGORY_REPOSITORY),
    CategoryService,
  ],
})
export class CategoryModule {}
