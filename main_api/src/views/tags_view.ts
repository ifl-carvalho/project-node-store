import Tag from '../models/Tag';

export default {
  render(tag: Tag) {
    return {
      id: tag.id,
      tags: tag.tag
    }
  },

  renderMany(tags: Tag[]) {
    return tags.map(tag => this.render(tag))
  }
};