// Return data for waypoint if provided, defaulting to route source waypoint
const d = (route, context, waypoint = route.source) => context.getDataForPage(waypoint)
  || Object.create(null);
// Field in waypoint (route source if waypoint is undefined) is equal to value
const isEqualTo = (field, value, waypoint) => (r, c) => d(r, c, waypoint)[field] === value;

const isGreaterThan = (field, value, waypoint) => (r, c) => parseInt(d(r, c, waypoint)[field], 10)
  > parseInt(value, 10);

// Way point was 'skipped' via skip link
const wasSkipped = (waypoint) => isEqualTo('__skipped__', true, waypoint);

// Field in waypoint is 'yes'
const isYes = (field, waypoint) => isEqualTo(field, 'yes', waypoint);

// Field in waypoint is 'no'
const isNo = (field, waypoint) => isEqualTo(field, 'no', waypoint);

module.exports = {
  wasSkipped,
  d,
  isNo,
  isYes,
  isEqualTo,
  isGreaterThan,
};
