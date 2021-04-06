import Tag from '../models/Tag';

export default {
  render(tag: Tag) {
    return {
      id: tag.id,
      name: tag.name
    }
  },

  renderMany(tags: Tag[]) {
    return tags.map(tag => this.render(tag))
  }
};