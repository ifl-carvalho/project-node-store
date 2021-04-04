import Product from '../models/Product';
import imagesView from './images_view';
import categoriesView from './categories_view';

export default {
  render(product: Product) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      discout: product.discount,
      amount: product.amount,
      title: product.title,
      description: product.description,
      images: imagesView.renderMany(product.images),
      categories: categoriesView.renderMany(product.categories)
    }
  },

  renderMany(product: Product[]) {
    return product.map(product => this.render(product))
  }
};