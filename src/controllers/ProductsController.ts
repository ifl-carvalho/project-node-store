import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';

import productsView from '../views/products_view';
import ProductsRepository from '../repositories/ProductsRepository';
import TagsRepository from '../repositories/TagsRepository';

export default {
  async index(request: Request, response: Response) {
    const reqTag = request.query.tag as (String | Array<String>);
    const order = request.query.order == "DESC" ? 'DESC' : 'ASC';
    const skip = request.query.skip || 0;
    const take = request.query.take || 500;

    const query = {
      reqTag,
      skip: +skip * +take,
      take: +take
    }

    const schema = Yup.object().shape({
      reqTag: Yup.lazy(val => (Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string())),
      order: Yup.string(),
      skip: Yup.number().required(),
      take: Yup.number().required(),
    });

    await schema.validate(query, { abortEarly: false });

    const productsRepository = getCustomRepository(ProductsRepository)
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.images', 'image')
    .leftJoinAndSelect('product.tags', 'tag')

    if ( typeof query.reqTag == "string" || ( query.reqTag instanceof String)) {
      productsRepository.andWhere('LOWER(tag.name) IN (LOWER(:tag))', { tag: query.reqTag })
    } else if ( Array.isArray(query.reqTag) ) {
      query.reqTag.map(tag => tag.toLowerCase())
      productsRepository.andWhere('LOWER(tag.name) IN (:...tag)', { tag: query.reqTag }) 
    }
    
    const [products, totalOfProducts] = await productsRepository.orderBy('product.id', order).take(query.take).skip(query.skip).getManyAndCount();
        
    return response.json({ pageCount: Math.ceil(totalOfProducts / query.take), products: productsView.renderMany(products)});
  },

  async show(request: Request, response: Response) {
    const { id } = request.query;

    const product = await getCustomRepository(ProductsRepository)
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.images', 'image')
    .leftJoinAndSelect('product.tags', 'tag')
    .where('product.id IN (:...id)', { id: id })
    .getMany();

    return response.json(productsView.renderMany(product));
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

    const requestTags = request.body.tags as string[]

    const tags = await Promise.all(requestTags.map(async tag => {
      const tagExist = await tagsRepository.findOne({ where: { name: tag } })
      return tagExist ? tagExist : { name: tag };
    }))

    let productData = {
      name,
      price: parseFloat(price),
      discount: parseFloat(discount),
      amount: parseInt(amount, 10),
      title,
      description,
      images,
      tags
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
        name: Yup.string().required(),
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

function andWhere(arg0: string, arg1: { tagName: string | import("qs").ParsedQs | string[] | import("qs").ParsedQs[]; }) {
  throw new Error('Function not implemented.');
}
