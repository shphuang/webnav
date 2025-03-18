import { Repository } from "../database/repository.ts";
import { Site } from "./class.ts";

export class SiteRepository implements Repository<Site> {
  private sites: Site[] = [];

  async getAll(): Promise<Site[]> {
    return [...this.sites];
  }

  async getById(id: string): Promise<Site | undefined> {
    const siteId = parseInt(id);
    return this.sites.find((site) => site.id === siteId);
  }

  async create(dto: Site): Promise<Site> {
    const newSite = {
      ...dto,
      id: this.sites.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Site;
    this.sites.push(newSite);
    return newSite;
  }
  async updateAll(sites: Site[]) {
    this.sites = sites;
  }
  async updateOne(id: string, dto: Site): Promise<Site | undefined> {
    const siteId = parseInt(id);
    const site = this.sites.find((s) => s.id === siteId);
    if (site) {
      Object.assign(site, { ...dto, updatedAt: new Date() });
      return site;
    }
    return undefined;
  }

  async deleteOne(id: string): Promise<boolean> {
    const siteId = parseInt(id);
    const index = this.sites.findIndex((site) => site.id === siteId);
    if (index !== -1) {
      this.sites.splice(index, 1);
      return true;
    }
    return false;
  }

  async deleteAll(): Promise<boolean> {
    this.sites = [];
    return true;
  }

  async getByCategoryId(categoryId: number): Promise<Site[]> {
    return this.sites.filter((site) => site.categoryId === categoryId);
  }

  async updateOrder(id: string, newOrder: number): Promise<Site | undefined> {
    const siteId = parseInt(id);
    const site = this.sites.find((s) => s.id === siteId);
    if (site) {
      site.order = newOrder;
      site.updatedAt = new Date();
      return site;
    }
    return undefined;
  }
}
