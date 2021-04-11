import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not, Raw } from 'typeorm';
import * as Yup from 'yup';

import categoriesView from '../views/categories_view';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TagsRepository from '../repositories/TagsRepository';

export default {
  async index(request: Request, response: Response) {
        const reqCategory = request.query.category as (String | Array<String>);
        const order = request.query.order == "DESC" ? 'DESC' : 'ASC';
    
        const query = {
          reqCategory,
        }
    
        const schema = Yup.object().shape({
          reqCategory: Yup.lazy(val => (Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string())),
        });
    
        await schema.validate(query, { abortEarly: false });
    
        const categoriesRepository = await getCustomRepository(CategoriesRepository)
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.images', 'image')
        .leftJoinAndSelect('category.tags', 'tag')

        if ( typeof query.reqCategory == "string" || ( query.reqCategory instanceof String)) {
          categoriesRepository.where('LOWER(category.name) IN (LOWER(:category))', { category: query.reqCategory })
        } else if ( Array.isArray(query.reqCategory) ) {
          query.reqCategory.map(tag => tag.toLowerCase())
          categoriesRepository.where('LOWER(category.name) IN (:...category)', { category: query.reqCategory }) 
        }
        
        const categories = await categoriesRepository.orderBy('category.id', order).getMany();
            
        return response.json(categoriesView.renderMany(categories));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const category = await getCustomRepository(CategoriesRepository)
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.images', 'image')
    .leftJoinAndSelect('product.tags', 'tag')
    .where('product.id = :id', { id: id })
    .getOneOrFail();

    return response.json(categoriesView.render(category));
  },

  async create(request: Request, response: Response) {
    const { name } = request.body;

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return { path: image.filename }
    });

    const tagsRepository = getCustomRepository(TagsRepository)

    const requestTags = request.body.tags as string[]

    const tags = await Promise.all(requestTags.map(async tag => {
      const tagExist = await tagsRepository.findOne({ where: { name: tag } })
      return tagExist ? tagExist : { name: tag };
    }))

    let categoryData = {
      name,
      images,
      tags
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required(),
      })).max(2),
      categorys: Yup.array(Yup.object().shape({
        id: Yup.number().integer(),
        name: Yup.string().required(),
      })),
    });

    await schema.validate(categoryData, { abortEarly: false });

    const category = categoriesRepository.create(categoryData);

    await categoriesRepository.save(category);

    return response.status(201).json(category);
  },

  async delete(request: Request, response: Response) {

  }
};