import { Injectable } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { Repository, UpdateResult } from 'typeorm';
import { Dog } from './entities/dog.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private readonly dogsRepository: Repository<Dog>,
  ) {}
  async create(createDogDto: CreateDogDto): Promise<Dog> {
    const dog = this.dogsRepository.create(createDogDto);
    return await this.dogsRepository.save(dog);
  }

  async findAll(): Promise<Dog[]> {
    return await this.dogsRepository.find();
  }

  async findOne(id: number): Promise<Dog> {
    return await this.dogsRepository.findOneBy({ id });
  }

  async update(id: number, updateDogDto: UpdateDogDto): Promise<UpdateResult> {
    return await this.dogsRepository.update(id, updateDogDto);
  }

  async remove(id: number): Promise<UpdateResult> {
    return this.dogsRepository.softDelete(id);
  }
}
