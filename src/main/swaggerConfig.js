const swaggerConfig = {
    definition: {
        info: {
            title: "Users API",
        },

        servers: [process.env.BASE_URL + process.env.NODE_DOCKER_PORT]
    },

    apis: ["./src/services/*.js"]
}

module.exports = {
    swaggerConfig
};
