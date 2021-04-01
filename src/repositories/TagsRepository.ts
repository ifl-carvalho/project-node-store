import { EntityRepository, Repository } from "typeorm";

import Tag from "../models/Tag";

@EntityRepository(Tag)
class TagsRepository extends Repository<Tag>{}

export default TagsRepository