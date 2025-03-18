import { Controller, Get } from '@danet/core';
import { Render } from '@danet/render';

@Controller('/api')
export class AppController {
  constructor() {
  }


  @Render('hello')
  @Get('/')
  renderANiceHTML() {
    return { title: "the page title", name: "world 111" };
  }
}
