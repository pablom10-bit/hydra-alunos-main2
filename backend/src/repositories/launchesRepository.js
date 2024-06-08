const launchModel = require("../models/launchModel");

async function launchExists(token) {
    const count = await launchModel.count({
        where: { token }
    })
    return count > 0;
}

async function insertLaunch(newLaunch) {
    return launchModel.create(newLaunch);
}

module.exports = {
    launchExists,
    insertLaunch
}