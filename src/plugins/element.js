import "@/assets/element-variables.scss";
import Vue from "vue";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

// configure language
locale.use(lang);

import {
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Switch,
  DatePicker,
  TimeSelect,
  TimePicker,
  Tabs,
  TabPane,
  Tag,
  Icon,
  Progress,
  Spinner,
  Collapse,
  Cascader,
  ColorPicker,
  Loading,
  MessageBox,
  Message,
  Popover
} from "element-ui";
Vue.use(Popover);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Progress);
Vue.use(Spinner);
Vue.use(Collapse);
Vue.use(Cascader);
Vue.use(ColorPicker);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
