import { IsString } from "class-validator";

export class CreateItemDto {
    @IsString()
    id: string;

    @IsString()
    item_name: string;

    @IsString()
    description: string;
}
