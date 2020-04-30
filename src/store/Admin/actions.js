import templateActions from "./subactions/templates";
import eventActions from "./subactions/events";
import taskActions from "./subactions/tasks";
export default {
  ...templateActions,
  ...eventActions,
  ...taskActions
};
