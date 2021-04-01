import Product from '../models/Product';
import imagesView from './images_view';
import tagsView from './tags_view';

export default {
  render(product: Product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      amount: product.amount,
      title: product.title,
      description: product.description,
      images: imagesView.renderMany(product.images),
      tags: tagsView.renderMany(product.tags)
    }
  },

  renderMany(product: Product[]) {
    return product.map(product => this.render(product))
  }
};