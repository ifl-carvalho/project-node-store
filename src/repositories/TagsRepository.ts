import { EntityRepository, Repository } from "typeorm";

import Tag from "../models/Tag";

@EntityRepository(Tag)
class tagsRepository extends Repository<Tag>{
    
}

export default tagsRepository