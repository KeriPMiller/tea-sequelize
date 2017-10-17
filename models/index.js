'use strict'

const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/teas', {
  logging: false
});

const Tea = db.define('tea', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  category: Sequelize.ENUM('green', 'black', 'herbal'),
  dollarPrice: {
    type: Sequelize.VIRTUAL,
    get: function() {
      const price = (+this.price / 100).toFixed(2);
      return `\$${price}`
    }
  }
}, {
  // add more functionality to our Tea model here!
  hooks: {
    beforeCreate(tea, options) {
      const properCase = []
      const words = tea.title.split(' ');
      for (let i = 0; i < words.length; i++) {
        words[i]= words[i].charAt(0).toUpperCase()+ words[i].slice(1);
        properCase.push(words[i])
      }
      tea.title = properCase.join(' ');
    }
  }
});

Tea.findByCategory = function(teaType) {
  return Tea.findAll({
    where: {
      category: teaType
    }
  })
}

Tea.prototype.findSimilar = function() {
  return Tea.findAll({
      where: {
        category: this.category
      }
    })
    .then(teas =>
      teas.filter(tea => tea.title === this.title ))
}

module.exports = {
  db,
  Tea
};
