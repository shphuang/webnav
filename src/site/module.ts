import { Module, TokenInjector } from "@danet/core";
import { SiteController } from "./controller.ts";
import { SiteRepository } from "./repository.ts";
import { SiteService } from "./service.ts";
import { SITE_REPOSITORY } from "./constant.ts";

@Module({
  controllers: [SiteController],
  injectables: [
    new TokenInjector(SiteRepository, SITE_REPOSITORY),
    SiteService,
  ],
})
export class SiteModule {}
