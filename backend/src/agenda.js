const nodeSchedule = require('node-schedule');
const hydra = require('./hydra');
const logger = require('./utils/logger');

const AGENDA = {};

const LOGS = process.env.AGENDA_LOGS === 'true';

async function runSchedule(id) {
    const isPingAutomation = typeof id === "string" && id.endsWith("P");
    const automationId = isPingAutomation ? Number(id.replace("P", "")) : Number(id);

    try {
        const automationsRepository = require('./repositories/automationsRepository');
        let automation = await automationsRepository.getAutomation(automationId);
        if (!automation.schedule) return;

        const plainAutomation = automation.get({ plain: true });
        const isLaunch = plainAutomation.name === `Launch ${plainAutomation.symbol}`;

        if (isPingAutomation) {
            const pingActionIndex = plainAutomation.actions.findIndex(a => a.type === "PING");
            plainAutomation.actions = [plainAutomation.actions[pingActionIndex]];
            plainAutomation.name = "PING";
            plainAutomation.condition = "true";
            plainAutomation.indexes = "";
        }
        else if (isLaunch) {
            plainAutomation.actions = [plainAutomation.actions[0]];
            plainAutomation.condition = "true";
            plainAutomation.indexes = "";
        }

        let result = await hydra.evalDecision("", plainAutomation);

        if (Array.isArray(result) && result.length)
            result = result.filter(r => r);

        if (isPingAutomation && (result || (Array.isArray(result) && result.every(r => r)))) {
            automation = await automationsRepository.getAutomation(automationId);
            cancelSchedule(automationId);
            addSchedule(automation);
        }

        if (!isLaunch && !isPingAutomation)
            await automationsRepository.updateAutomation(id, { isActive: false });

        if (LOGS || automation.logs) logger('A:' + id, `The Scheduled Automation #${id} has fired at ${new Date()}!\n${JSON.stringify(result)}`);
    } catch (err) {
        console.error(err);
    }
}

function addSchedule(automation) {
    if (!automation.schedule) return;
    let job;

    const date = Date.parse(automation.schedule);
    if(date < Date.now()) return;

    job = nodeSchedule.scheduleJob(date, () => {
        runSchedule(automation.id);
    });

    if (!job) throw new Error(`Cant schedule the job. Probably invalid date/cron. schedule: ${automation.schedule}`);

    AGENDA[automation.id] = job;
    if (LOGS || automation.logs) logger('A:' + automation.id, `The Scheduled Automation #${automation.id} (${automation.schedule}) was added to agenda at ${new Date()}!`);
}

function cancelSchedule(id) {
    if (!AGENDA[id]) return;
    AGENDA[id].cancel();
    delete AGENDA[id];
    if (LOGS) logger('A:' + id, `The Schedule Automation #${id} was deleted from agenda at ${new Date()}!`);
}

function getAgenda() {
    return Object.entries(AGENDA).map(props => {
        return {
            id: props[0],
            next: props[1] ? props[1].nextInvocation() : null
        }
    })
}

module.exports = {
    addSchedule,
    cancelSchedule,
    getAgenda
}
