const createUserWithEmailAndPassword = (auth,
                                        email,
                                        password) => {
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
    createUserWithEmailAndPassword
}
