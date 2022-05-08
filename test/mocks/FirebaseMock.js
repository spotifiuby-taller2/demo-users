const createUser = (email,
                    emailVerified,
                    password,
                    disabled) => {
    return new Promise( () => {
        return {
            user: {
                uid: "uid",
                accessToken: "token"
            }
        }
    } );
}

module.exports = {
    createUser
}
