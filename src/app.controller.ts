import { Controller, Get, Query } from '@danet/core';
import { Render } from '@danet/render';
import { getIconUrl } from './utils/index.ts';

@Controller('/api')
export class AppController {
  constructor() {
  }

  @Render('hello')
  @Get('/')
  renderANiceHTML() {
    return { title: 'the page title', name: 'world 111' };
  }

  @Get('/icon')
  async iconUrl(@Query('url') url: string) {
    const iconUrl = await getIconUrl(url);
    return iconUrl || '/favicon.svg';
  }
}
