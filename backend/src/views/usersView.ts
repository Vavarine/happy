import User from '../models/User';
import orphanagesView from './orphanagesView';

export default {
  renderUserOrphanages(user: User) {
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      admin: user.admin,
      orphanages: orphanagesView.renderMany(user.orphanages)
    }
  },

  render(user: User) {
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
    }
  },

  renderMany(users: User[]) {
    return users.map(user => this.render(user));
  },

  renderManyUserOrphanages(users: User[]) {
    return users.map(user => this.renderUserOrphanages(user));
  }
}