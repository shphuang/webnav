import { bootstrap } from '../src/bootstrap.ts';
import { afterAll, afterEach, beforeAll, describe, it } from '@std/testing/bdd';
import {
  assertArrayIncludes,
  assertEquals,
  assertExists,
  assertRejects,
} from '@std/assert';
import { Category } from '../src/category/class.ts';
import { CategoryService } from '../src/category/service.ts';
import { DanetApplication } from '@danet/core';

let app: DanetApplication;
let server;
let categoryService: CategoryService;
let port: number;
const payload: Category = {
  id: 1,
  name: '测试分类',
};

describe('Category', () => {
  beforeAll(async () => {
    app = await bootstrap();
    server = await app.listen(0);
    categoryService = await app.get<CategoryService>(CategoryService);
    port = server.port;
  });

  afterAll(async () => {
    await app.close();
  });

  it('创建分类', async () => {
    const res = await fetch(`http://localhost:${port}/categories`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const returnedData: Category = await res.json();
    assertEquals(returnedData.id, payload.id);
    assertEquals(returnedData.name, payload.name);
  });

  it('创建重复名称的分类应该失败', async () => {
    await categoryService.create(payload);
    const res = await fetch(`http://localhost:${port}/categories`, {
      method: 'POST',
      body: JSON.stringify({
        id: 2,
        name: payload.name,
        description: '另一个描述',
      }),
    });
    assertEquals(res.status, 500);
    const data = await res.json();
    assertEquals(data.message, '分类名称已存在');
  });

  it('获取所有分类', async () => {
    const firstCategory = await categoryService.create({
      id: 1,
      name: '分类1',
    });
    const secondCategory = await categoryService.create({
      id: 2,
      name: '分类2',
    });

    const res = await fetch(`http://localhost:${port}/categories`, {
      method: 'GET',
    });

    const returnedData: Category[] = await res.json();
    assertEquals(returnedData.length, 2);
    const plainArray = JSON.parse(
      JSON.stringify([firstCategory, secondCategory]),
    );
    assertArrayIncludes(returnedData, plainArray);
  });

  it('根据ID获取分类', async () => {
    const category = await categoryService.create(payload);
    const res = await fetch(
      `http://localhost:${port}/categories/${category.id}`,
      {
        method: 'GET',
      },
    );
    const returnedCategory: Category = await res.json();
    const plainObject = JSON.parse(JSON.stringify(category));
    assertEquals(returnedCategory, plainObject);
  });

  it('更新分类', async () => {
    const category = await categoryService.create(payload);
    const updateData = {
      name: '更新后的分类',
      description: '更新后的描述',
    };
    await fetch(`http://localhost:${port}/categories/${category.id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    const returnedCategory =
      await (await fetch(`http://localhost:${port}/categories/${category.id}`, {
        method: 'GET',
      })).json();

    assertEquals(returnedCategory.name, updateData.name);
    assertEquals(returnedCategory.description, updateData.description);
  });

  it('删除分类', async () => {
    const category = await categoryService.create(payload);
    const res = await fetch(
      `http://localhost:${port}/categories/${category.id}`,
      {
        method: 'DELETE',
      },
    );
    const result = await res.json();
    assertEquals(result.message, '分类删除成功');
    assertEquals(
      await categoryService.getById(category.id.toString()),
      undefined,
    );
  });
});
