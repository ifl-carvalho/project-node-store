import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';

import productView from '../views/products_view';
import ProductsRepository from '../repositories/ProductsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

export default {
  async index(request: Request, response: Response) {
    const productsRepository = getCustomRepository(ProductsRepository);

    const products = await productsRepository.find({
      relations: ['images', 'categories'],
    });

    return response.json(productView.renderMany(products));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const productsRepository = getCustomRepository(ProductsRepository);

    const product = await productsRepository.findOneOrFail(id, {
      relations: ['images', 'categories'],
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


    const categoriesRepository = getCustomRepository(CategoriesRepository)

    const requestCategories = request.body.categories as Array<string>

    const categories = requestCategories.map(category => {
      return { category: category }
    });

    const categoriesExist = async category => {
      const categoryExist = await categoriesRepository.find({ where: { category: category } })
      return categoryExist[0]
    }

    const categoriesCheck = await Promise.all(requestCategories.map(categoriesExist))

    const categoriesModel = () => {
      if(categoriesCheck[0] == null) {
        return categories
      } else {
        return categoriesCheck
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
      categories: categoriesModel()
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
      categories: Yup.array(Yup.object().shape({
        id: Yup.string(),
        category: Yup.string().required(),
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