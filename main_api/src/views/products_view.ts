import Product from '../models/Product';
import imagesView from './images_view';

export default {
  render(product: Product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      title: product.title,
      description: product.description,
      images: imagesView.renderMany(product.images)
    }
  },

  renderMany(product: Product[]) {
    return product.map(product => this.render(product))
  }
};