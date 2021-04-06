import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';

import categoriesView from '../views/categories_view';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TagsRepository from '../repositories/TagsRepository';

export default {
  async index(request: Request, response: Response) {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categories = await categoriesRepository.find({
      relations: ['images', 'tags'],
    });

    return response.json(categoriesView.renderMany(categories));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categories = await categoriesRepository.findOneOrFail(id, {
      relations: ['images', 'tags'],
    });

    return response.json(categoriesView.render(categories));
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
      tags: Yup.array(Yup.object().shape({
        id: Yup.string(),
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