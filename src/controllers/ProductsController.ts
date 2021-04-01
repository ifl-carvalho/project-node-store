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

  /* TODO:
   * O select na tabela Tags está pegando apenas 1 objeto,
   * precisa ser modificado para buscar mais de uma.
   */
  async create(request: Request, response: Response) {

    const {
      name,
      price,
      amount,
      title,
      description,
      tag,
    } = request.body;

    const productsRepository = getCustomRepository(ProductsRepository);

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return {
        path: image.filename
      }
    });

    const tagsRepository = getCustomRepository(TagsRepository);

    const tagModel = await tagsRepository.findOneOrFail({ tag });

    const productData = {
      name,
      price,
      amount,
      title,
      description,
      images,
      tags: [tagModel], // deve ser uma lista pois o orm espera uma lista de objeto
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      amount: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required(),
      })).max(5),
      tag: Yup.string().required(),
    });

    await schema.validate(productData, { abortEarly: false });

    const product = productsRepository.create(productData);

    await productsRepository.save(product);

    return response.status(201).json(product);
  },

  async delete(request: Request, response: Response) {

  }
};