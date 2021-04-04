import { EntityRepository, Repository } from "typeorm";

import Category from "../models/Category";

@EntityRepository(Category)
class categoriesRepository extends Repository<Category>{
    
}

export default categoriesRepository