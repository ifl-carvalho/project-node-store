import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';

import productView from '../views/products_view';
import ProductsRepository from '../repositories/ProductsRepository';
import TagsRepository from '../repositories/TagsRepository';

export default {
  async index(request: Request, response: Response) {
    const productsRepository = getCustomRepository(ProductsRepository);

    const products = await productsRepository.find({
      relations: ['images', 'tags'],
    });

    return response.json(productView.renderMany(products));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findOneOrFail(id, {
      relations: ['images', 'tags'],
    });

    return response.json(productView.render(product));
  },

  async create(request: Request, response: Response) {
    
    const {
      name,
      price,
      discount,
      amount,
      title,
      description
    } = request.body;

    const productsRepository = getCustomRepository(ProductsRepository);

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return { path: image.filename }
    });


    const tagsRepository = getCustomRepository(TagsRepository)

    const requestTags = request.body.categories as Array<string>

    const tags = requestTags.map(tag => {
      return { tag: tag }
    });

    const tagsExist = async tag => {
      const tagExist = await tagsRepository.find({ where: { tag: tag } })
      return tagExist[0]
    }

    const tagsCheck = await Promise.all(requestTags.map(tagsExist))

    const tagsModel = () => {
      if(tagsCheck[0] == null) {
        return tags
      } else {
        return tagsCheck
      }
    }

    let productData = {
      name,
      price,
      discount,
      amount,
      title,
      description,
      images,
      tags: tagsModel()
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      discount: Yup.number().required(),
      amount: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required(),
      })).max(5),
      tags: Yup.array(Yup.object().shape({
        id: Yup.string(),
        tag: Yup.string().required(),
      })).max(5),
    });

    await schema.validate(productData, { abortEarly: false });

    const product = productsRepository.create(productData);

    await productsRepository.save(product);

    return response.status(201).json(product);
  },

  async delete(request: Request, response: Response) {

  }
};