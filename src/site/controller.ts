import { Controller, Get, Post, Put, Delete, Body, Param } from '@danet/core';
import { Site } from './class.ts';
import { SiteService } from './service.ts';

@Controller('api/sites')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get()
  async getAllSites() {
    return this.siteService.getAll();
  }

  @Get(':id')
  async getSiteById(@Param('id') id: string) {
    return this.siteService.getById(id);
  }

  @Post()
  async createSite(@Body() site: Site) {
    return this.siteService.create(site);
  }

  @Put(':id')
  async updateSite(
    @Param('id') id: string,
    @Body() site: Site,
  ) {
    return this.siteService.update(id, site);
  }

  @Delete(':id')
  async deleteSite(@Param('id') id: string) {
    await this.siteService.delete(id);
    return { message: '网站删除成功' };
  }

  @Get('category/:categoryId')
  async getSitesByCategoryId(@Param('categoryId') categoryId: string) {
    return this.siteService.getByCategoryId(parseInt(categoryId));
  }

  @Put(':id/order')
  async updateSiteOrder(
    @Param('id') id: string,
    @Body() orderSite:Site
  ) {
    return this.siteService.updateOrder(orderSite);
  }
}