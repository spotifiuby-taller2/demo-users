class DateMock {
    constructor() {

    }

    toISOString() {
        return '222T';
    }

    getHours() {
        return 0;
    }

    setHours(hours) {
        return;
    }
}

module.exports = {
    DateMock
}