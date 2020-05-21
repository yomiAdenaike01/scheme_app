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
  Input,
  InputNumber,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Button,
  DatePicker,
  TimeSelect,
  TimePicker,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Icon,
  Progress,
  Spinner,
  Option,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Loading,
  MessageBox,
  Message,
  Notification,
  Drawer,
  Popover
} from "element-ui";
Vue.use(Popover);
Vue.use(Autocomplete);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tag);
Vue.use(Icon);
Vue.use(Progress);
Vue.use(Spinner);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cascader);
Vue.use(ColorPicker);
Vue.use(Drawer);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
