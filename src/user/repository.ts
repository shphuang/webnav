import { Repository } from '../database/repository.ts';
import { User } from './class.ts';

export class UserRepository implements Repository<User> {
  async getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async getById(id: string): Promise<User | undefined> {
    throw new Error('Method not implemented.');
  }
  async create(dto: unknown): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async updateOne(id: string, dto: User): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  async deleteOne(id: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  async deleteAll(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}
