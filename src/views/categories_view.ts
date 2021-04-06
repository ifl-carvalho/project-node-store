import Category from '../models/Category';
import tagsView from './tags_view';
import imagesView from './images_view'

export default {
  render(category: Category) {
    return {
      id: category.id,
      name: category.name,
      images: imagesView.renderMany(category.images),
      tags: tagsView.renderMany(category.tags)
    }
  },

  renderMany(categories: Category[]) {
    return categories.map(category => this.render(category))
  }
};