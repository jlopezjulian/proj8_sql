/**
 * Creating the Book model
 * ensuring correct data types are being set
 */


"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  //properties are given that should be reflected in DB Browser for SQlite3
  Book.init(
    {
      title: {
        type: DataTypes.STRING, //datatype
        allowNull: false, //setting property to false
        validate: { //allows for custom validation to test if there is a value
          notEmpty: {
            msg: 'Title is required', //appropriate error message for title from the template provided
          },
        },
      },
      author: {
        type: DataTypes.STRING, //datatype
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Author is required', //appropriate error message for author from the template provided
          },
        },
      },
      genre: DataTypes.STRING, //datatype
      year: DataTypes.INTEGER, //datetype
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};