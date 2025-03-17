import { IsString, LengthLowerOrEqual } from '@danet/core/validation';

export class Category {
  public id: number;

  @IsString()
  @LengthLowerOrEqual(20)
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
