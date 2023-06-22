/**
 * This simply collates all of journeys together in an array.
 */
const { Plan } = require('@dwp/govuk-casa');

const graphlib = require('graphlib');
const dot = require('graphlib-dot');
const equipmentOrAdaptation = require('./journeys/equipment-or-adaptation');
const supportWorker = require('./journeys/support-worker');
const travelToWork = require('./journeys/travel-to-work');
const claim = require('./journeys/claim');
const account = require('./journeys/account');
const workplaceContact = require('./journeys/amend-workplace-contact');
const personalInformation = require('./journeys/personal-information');

// eslint-disable-next-line no-multi-assign
exports = module.exports = () => {
  const plan = new Plan();
  equipmentOrAdaptation(plan);
  supportWorker(plan);
  travelToWork(plan);
  claim(plan);
  account(plan);
  workplaceContact(plan);
  personalInformation(plan);

  if (process.env.NODE_ENV !== 'production') {
    // JSON serialisation is needed to remove any undefined labels, which can trip
    // up graphlib-dot
    const graph = plan.getGraphStructure();
    const json = JSON.stringify(graphlib.json.write(graph));
    const graphcopy = graphlib.json.read(JSON.parse(json));

    process.stdout.write(dot.write(graphcopy));
  }

  return plan;
};
