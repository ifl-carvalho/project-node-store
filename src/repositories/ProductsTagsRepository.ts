import { EntityRepository, Repository } from "typeorm";

import ProductTag from "../models/ProductTag";

@EntityRepository(ProductTag)
class ProductTagsRepository extends Repository<ProductTag>{}

export default ProductTagsRepository