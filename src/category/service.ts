import { Inject, Injectable } from '@danet/core';
import { Category } from './class.ts';
import { CATEGORY_REPOSITORY } from './constant.ts';
import type { Repository } from '../database/repository.ts';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private repository: Repository<Category>,
  ) {}

  async getAll(): Promise<Category[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<Category | undefined> {
    return this.repository.getById(id);
  }

  async create(category: Category): Promise<Category> {
    // 检查名称是否已存在
    const nameExists = await this.repository.getAll().then((categories) =>
      categories.some((c) => c.name === category.name)
    );
    if (nameExists) {
      throw new Error('分类名称已存在');
    }

    // 检查 ID 是否已存在
    const idExists = await this.repository.getAll().then((categories) =>
      categories.some((c) => c.id === category.id)
    );
    if (idExists) {
      throw new Error('分类 ID 已存在');
    }
    return this.repository.create(category);
  }

  async update(id: string, category: Category) {
    return this.repository.updateOne(id, category);
  }

  async delete(id: string) {
    this.repository.deleteOne(id);
  }
}
