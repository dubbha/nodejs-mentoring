import { IsUUID } from 'class-validator';

export class FindOneParams {
  @IsUUID(4)
  id: string;
}
