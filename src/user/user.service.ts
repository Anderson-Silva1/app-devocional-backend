import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseApiDto } from 'src/common/dto/response-api.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Helper method to find user by ID
  private async findUserEntityById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Mapping UserEntity to ResponseUserDto
  private toResponseDto(user: UserEntity): ResponseUserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers({
    limit = 10,
    offset = 0,
  }: {
    limit: number;
    offset: number;
  }) {
    // console.log('Limit:', limit, 'Offset:', offset);

    const users = await this.userRepository.find({ take: limit, skip: offset });

    return {
      message: 'Listando todos os usuários com sucesso',
      sucess: true,
      data: users.map((user) => this.toResponseDto(user)),
    } as ResponseApiDto<ResponseUserDto[]>;
  }

  async getUserById(id: string) {
    const user = await this.findUserEntityById(id);

    return {
      message: 'Usuário encontrado com sucesso',
      sucess: true,
      data: this.toResponseDto(user),
    } as ResponseApiDto<ResponseUserDto>;
  }

  async createUser(dto: CreateUserDto) {
    // verificar se email existe
    const emailExists = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (emailExists) throw new ConflictException('Email already exists');

    // Fazer o hash de senha

    const user = this.userRepository.create(dto);

    const newUser = await this.userRepository.save(user);

    return {
      message: 'Usuário criado com sucesso',
      sucess: true,
      data: this.toResponseDto(newUser),
    } as ResponseApiDto<ResponseUserDto>;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    // Verificar se user existe
    const user = await this.findUserEntityById(id);

    // Verificar se o email ja esta em uso
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: dto.email,
      });

      if (emailExists) throw new ConflictException('Email already exists');
    }

    await this.userRepository.update(id, dto);

    const updatedUser = await this.findUserEntityById(id);

    return {
      message: 'Usuário atualizado com sucesso',
      sucess: true,
      data: this.toResponseDto(updatedUser),
    } as ResponseApiDto<ResponseUserDto>;
  }

  async deleteUser(id: string) {
    // Verificar se user existe
    const user = await this.findUserEntityById(id);

    // Adicionar soft delete
    await this.userRepository.softDelete(id);

    // Return the deleted user
    return {
      message: 'Usuário deletado com sucesso',
      sucess: true,
      meta: { deletedAt: true },
      data: this.toResponseDto(user),
    } as ResponseApiDto<ResponseUserDto>;
  }

  async restoreUser(id: string) {
    // Verificar se user existe
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.restore(id);

    return {
      message: 'Usuário recuperado com sucesso',
      sucess: true,
      meta: { restored: true },
      data: this.toResponseDto(user),
    } as ResponseApiDto<ResponseUserDto>;
  }
}
