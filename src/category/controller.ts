import { Body, Controller, Delete, Get, Param, Post, Put } from '@danet/core';
import { Category } from './class.ts';
import { CategoryService } from './service.ts';
import { ReturnedType } from '@danet/swagger/decorators';

@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ReturnedType(Category, true)
  @Get()
  async getAllCategories() {
    return this.categoryService.getAll();
  }

  @ReturnedType(Category)
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getById(id);
  }

  @ReturnedType(Category)
  @Post()
  async createCategory(@Body() category: Category) {
    return this.categoryService.create(category);
  }

  @ReturnedType(Category)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() category: Category,
  ) {
    return this.categoryService.update(id, category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return { message: '分类删除成功' };
  }
}
