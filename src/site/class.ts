export class Site {
  id: number;
  name: string;
  url: string;
  icon?: string;
  description?: string;
  categoryId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    categoryId: number,
    name: string,
    url: string,
    order: number,
    createdAt: Date,
    updatedAt: Date,
    icon?: string,
    description?: string
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.icon = icon;
    this.description = description;
    this.categoryId = categoryId;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
