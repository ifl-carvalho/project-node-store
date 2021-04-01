import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as Yup from 'yup';

import tagView from '../views/tags_view';

import TagsRepository from '../repositories/TagsRepository';

export default {
  async index(request: Request, response: Response) {
    const tagsRepository = getCustomRepository(TagsRepository);

    const tags = await tagsRepository.find({
      relations: [ 'products' ],
    });

    return response.json(tagView.renderMany(tags));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const tagsRepository = getCustomRepository(TagsRepository);

    const tag = await tagsRepository.findOneOrFail(id, {
      relations: [ 'products'] ,
    });

    return response.json(tagView.render(tag));
  },

  async create(request: Request, response: Response) {
    
    
    const tagsRepository = getCustomRepository(TagsRepository)

    const requestTags = request.body.tags as Array<string>

    const tags = requestTags.map(tag => ({ tag: tag }));

    for ( let i = 0; i < tags.length; i++ ) {
      const tagCheck = await tagsRepository.findOne(tags[i])

      if(tagCheck) {
        tags.filter( tag => !(tag == tagCheck))
      }
    }

    const tags: Array<string> = request.body.tags;

    const tagsRepository = getCustomRepository(TagsRepository);

    const tag = tags.map(tag => {
      return {
        tag: tag
      }
    });

    const schema = Yup.object().shape({
        tag: Yup.string(),
    });

    await schema.validate(tag, { abortEarly: false });

    const product = tagsRepository.create(tag);

    await tagsRepository.save(product);

    return response.status(201).json(product);
  },

  async delete(request: Request, response: Response) {

  }
};