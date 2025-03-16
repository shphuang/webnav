import { Controller, Get } from '@danet/core';
import { Render } from 'https://jsr.io/@danet/core/2.4.3/src/renderer/decorator.ts';

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
