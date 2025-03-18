import { Category } from '../category/class.ts';
import { Site } from '../site/class.ts';

export class User {
  id: number;
  username: string;
  password: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  categories: Category[] = [];
  sites: Site[] = [];

  constructor(
    id: number,
    username: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    email?: string,
    avatar?: string,
    categories: Category[] = [],
    sites: Site[] = [],
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.avatar = avatar;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.categories = categories;
    this.sites = sites;
  }
}
