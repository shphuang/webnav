import { Repository } from '../database/repository.ts';
import { Category } from './class.ts';

export class CategoryRepository implements Repository<Category> {
  private categories: Category[] = [];

  async getAll(): Promise<Category[]> {
    return [...this.categories];
  }
  async getById(id: string): Promise<Category | undefined> {
    const categoryId = parseInt(id);
    return this.categories.find((category) => category.id === categoryId);
  }
  async create(dto: Category): Promise<Category> {
    const newCategory = { ...dto, id: this.categories.length + 1 };
    this.categories.push(newCategory);
    return newCategory;
  }
  async updateOne(id: string, dto: Category) {
    this.categories.forEach((t: Category) => {
      if (t.id === parseInt(id)) {
        Object.assign(t, dto);
        return t;
      }
    });
    return undefined;
  }
  async deleteOne(id: string): Promise<unknown> {
    const categoryId = parseInt(id);
    const index = this.categories.findIndex((category) =>
      category.id === categoryId
    );
    if (index !== -1) {
      this.categories.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
  async deleteAll(): Promise<unknown> {
    this.categories = [];
    return true;
  }
}
