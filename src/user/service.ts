import { Inject, Injectable } from '@danet/core';
import { User } from './class.ts';
import { UserRepository } from './repository.ts';
import { USER_REPOSITORY } from './constant.ts';
import { CATEGORY_REPOSITORY } from '../category/constant.ts';
import { SITE_REPOSITORY } from '../site/constant.ts';
import { CategoryRepository } from '../category/repository.ts';
import { SiteRepository } from '../site/repository.ts';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private repository: UserRepository,
    @Inject(CATEGORY_REPOSITORY) private categoryRepository: CategoryRepository,
    @Inject(SITE_REPOSITORY) private siteRepository: SiteRepository,
  ) {}

  async updateUser(id: number, user: User) {
    let [categories, sites] = await Promise.all([
      this.categoryRepository.getAll(),
      this.siteRepository.getAll(),
    ]);
    if (categories.length === 0) {
      categories = user.categories;
    }
    if (sites.length === 0) {
      sites = user.sites;
    }

    await Promise.all([
      this.categoryRepository.updateAll(categories),
      this.siteRepository.updateAll(sites),
    ]);
    user.categories = categories;
    user.sites = sites;
    return user;
  }
}
