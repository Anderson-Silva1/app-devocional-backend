import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  getAllUsers({ limit = 10, offset = 0 }: { limit: number; offset: number }) {
    console.log('Limit:', limit, 'Offset:', offset);
    return this.userRepository.find({ take: limit, skip: offset });
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async createUser(dto: CreateUserDto) {
    // verificar se email existe
    const emailExists = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (emailExists) throw new ConflictException('Email already exists');

    const user = this.userRepository.create(dto);

    return this.userRepository.save(user);
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    // Verificar se user existe
    const user = await this.getUserById(id);

    // Verificar se o email ja esta em uso
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: dto.email,
      });

      if (emailExists) throw new ConflictException('Email already exists');
    }

    await this.userRepository.update(id, dto);

    return { ...user, ...dto };
  }

  async deleteUser(id: string) {
    // Verificar se user existe
    await this.getUserById(id);

    // Adicionar soft delete
    await this.userRepository.softDelete(id);

    // Return the deleted user
    return { restore: true, user: await this.getUserById(id) };
  }
  async restoreUser(id: string) {
    // Verificar se user existe
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.restore(id);

    return { restore: true, user: await this.getUserById(id) };
  }
}
