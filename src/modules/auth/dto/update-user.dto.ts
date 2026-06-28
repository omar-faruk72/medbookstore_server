import { IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateRoleDto {
  @IsNotEmpty({ message: 'রোল দেওয়া বাধ্যতামূলক' })
  @IsEnum(UserRole, { message: 'সঠিক রোল সিলেক্ট করুন (user, admin, manager)' })
  role!: UserRole;
}