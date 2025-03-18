import { Inject, Injectable } from "@danet/core";
import { Site } from "./class.ts";
import { SiteRepository } from "./repository.ts";
import { SITE_REPOSITORY } from "./constant.ts";

@Injectable()
export class SiteService {
  constructor(
    @Inject(SITE_REPOSITORY) private siteRepository: SiteRepository
  ) {}

  async getAll(): Promise<Site[]> {
    return this.siteRepository.getAll();
  }

  async getById(id: string): Promise<Site> {
    const site = await this.siteRepository.getById(id);
    if (!site) {
      throw new Error("网站不存在");
    }
    return site;
  }

  async create(site: Site): Promise<Site> {
    if (!site.name || !site.url || !site.categoryId) {
      throw new Error("标题、URL和分类ID为必填项");
    }
    return this.siteRepository.create(site);
  }

  async update(id: string, site: Site): Promise<Site> {
    const existingSite = await this.siteRepository.getById(id);
    if (!existingSite) {
      throw new Error("网站不存在");
    }
    const updatedSite = await this.siteRepository.updateOne(id, site);
    if (!updatedSite) {
      throw new Error("更新网站失败");
    }
    return updatedSite;
  }

  async delete(id: string): Promise<void> {
    const success = await this.siteRepository.deleteOne(id);
    if (!success) {
      throw new Error("删除网站失败");
    }
  }

  async getByCategoryId(categoryId: number): Promise<Site[]> {
    return this.siteRepository.getByCategoryId(categoryId);
  }

  async updateOrder(orderSite: Site): Promise<Site> {
    const sites: Site[] = await this.siteRepository.getByCategoryId(
      orderSite.categoryId
    );
    const currentIndex = sites.findIndex((site) => site.id === orderSite.id);
    const [currentSite] = sites.splice(currentIndex, 1);
    const targetIndex = orderSite.order;
    sites.splice(targetIndex, 0, currentSite);

    sites.forEach((site, index) => {
      site.order = index;
    });

    await this.siteRepository.updateAll(sites);
    return currentSite; // 修改返回值为当前站点对象，而不是站点数组
  }
}
