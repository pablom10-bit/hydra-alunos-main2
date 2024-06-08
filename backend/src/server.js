const database = require('./db');
const app = require('./app');
const usersRepository = require('./repositories/usersRepository');
const appEm = require('./app-em');
const appWs = require('./app-ws');
const hydra = require('./hydra');
const logger = require('./utils/logger');
const automationsController = require("./controllers/automationsController");

(async () => {
    console.log(`Your Node.js version is ${process.version}.`);

    logger('system', 'Initializing the Hydra Brain...');

    let users = await usersRepository.getActiveUsers();
    users = users.map(u => u.get({ plain: true }));
    await hydra.init(users);

    logger('system', `Starting the Hydra Agenda...`);
    await automationsController.scheduleAutomations(users.map(u => u.automations).flat());

    logger('system', `Starting the server apps...`);
    const server = app.listen(process.env.PORT, () => {
        logger('system', 'App is running at ' + process.env.PORT);
    })

    const wss = appWs(server);
    appEm.init(users, wss, hydra);

})();