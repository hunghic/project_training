import { find } from 'rxjs';
import { BaseEntity, DeepPartial, Like, Repository } from 'typeorm';

export class TypeOrmRepository<T extends BaseEntity> {
  public repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }
  save(data: any): Promise<T> {
    return this.repository.save(data);
  }

  update(id: string | number | string[] | Date | number[] | Date[], data: any): Promise<any> {
    return this.repository.update(id, data);
  }
  delete(data: any): Promise<any> {
    return this.repository.delete(data);
  }

  async findOneByCondition(conditions: any): Promise<T> {
    return this.repository.findOne(conditions);
  }
  public async getAll(): Promise<any> {
    return this.repository.find({
      
    })
  }
  public async getAllPage(perPage, pageNumber): Promise<any> {
    return this.repository.find({
      take: perPage,
      skip: (pageNumber-1)*perPage,
    })
  }
  async listSearch(conditions: any): Promise<T[]> {
     return this.repository.find({where: {name: Like(`%${conditions.name}%`)}}); 
    }
  async productSearch(conditions: any): Promise<T[]> {
    return this.repository.find({where: {
      name: Like(`%${conditions.name}%`),
      brand: Like(`%${conditions.brand}%`),
      category: Like(`%${conditions.category}%`)
    }}); 
   }
   async productSearchByFlashsale(conditions: any): Promise<T[]> {
    return this.repository.find({where: {
      flashsaleDetail: Like(`%${conditions.flashsaleDetail}%`),
    }}); 
   }
   async getUserByEmail(email: string): Promise<T[]>{
    return await this.repository.find({where:{email: email}});
   }
   async getUserByCode(conditions: any): Promise<T>{
    return this.repository.findOne({where: {
      code: Like(`%${conditions.code}%`),
    }});
   }
   
   async searchOrderDetail(conditions: any): Promise<T[]> {
    return this.repository.find({ where: { order: Like(`%${conditions.order}%`) } });
  }
}
