import Product from '../models/Product';
import imagesView from './images_view';
import tagsView from './tags_view';

export default {
  render(product: Product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      discount: product.discount.toString(),
      amount: product.amount.toString(),
      title: product.title,
      description: product.description,
      images: imagesView.renderMany(product.images),
      tags: tagsView.renderMany(product.tags)
    }
  },

  renderMany(products: Product[]) {
    return products.map(product => this.render(product))
  }
};