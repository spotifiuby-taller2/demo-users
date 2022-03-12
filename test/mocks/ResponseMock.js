class ResponseMock {
    constructor() {
        this.myStatus = 0;
        this.myJson = {};
    }

    getStatus() {
        return this.myStatus;
    }

    status(code) {
        this.myStatus = code;
        return this;
    }

    json(json) {
        this.myJson = json;
        return this;
    }
}

module.exports = ResponseMock;