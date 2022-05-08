const constants = require("../others/constants");
const {Restaurants} = require("../data/Restaurants");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {setErrorResponse} = require("../others/utils");
const {setBodyResponse} = require("../others/utils");
const {Op} = require("sequelize");

class RestaurantService {
    defineEvents(app) {
        /**
         * @swagger
         * /restaurants/list:
         *   post:
         *    summary: Restaurants list.
         *
         *    description: Return list of users.
         *
         *    responses:
         *         "200":
         *           description: "Returning list."
         *
         *         "500":
         *           description: "Database error."
         */
        app.get( constants.RESTAURANTS_LIST_URL,
            this.listRestaurants
                .bind(this) );

        /**
         * @swagger
         * /restaurants/new:
         *   post:
         *    summary: Create a restaurant.
         *
         *    description: Add a new restaurant to the database.
         *
         *    responses:
         *         "200":
         *           description: "Restaurant created."
         *
         *         "500":
         *           description: "Database error."
         */
        app.get( constants.RESTAURANTS_LIST_URL,
            this.createRestaurant
                .bind(this) );
    }

    async listRestaurants(req,
                          res) {
        Logger.info("Request a /restaurants/list");

        const restaurants = await Restaurants.findAll()
                                            .catch(error => {
                                                return {
                                                    error: error.toString()
                                                };
                                        } );

        if (restaurants.error !== undefined) {
            Logger.error(restaurants.error);

            return setErrorResponse(restaurants.error,
                                    500,
                                    res);
        }

        return this.getFormattedRestaurants(restaurants,
                                            res);
    }

    async createRestaurant(req,
                          res) {
        Logger.info("Request a /restaurants/new");

        const name = req.body
                        .name;

        const response = await Restaurants.create( {
                name: name
            } ).catch(error => {
                    return {
                        error: error.toString()
                    };
        } );

        if (response.error !== undefined) {
            Logger.error(response.error);

            return setErrorResponse(response.error,
                                    500,
                                    res);
        }

        const result = {
            result: "ok"
        }

        return setBodyResponse(result,
                               200,
                               res);
    }

    getFormattedRestaurants(restaurants,
                            res) {
        const formattedRestaurants = [];

        restaurants.forEach(restaurant => {
            formattedRestaurants.push( {
                id: restaurant.dataValues
                              .id,

                name: restaurant.dataValues
                                .name,
            } );
        } );

        const response = {
            restaurants: formattedRestaurants
        }

        return setBodyResponse(response,
                               200,
                               res);
    }
}

module.exports = {
    RestaurantService
}
