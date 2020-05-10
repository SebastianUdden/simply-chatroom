import {
  updateMessages,
  contains,
  nameChange,
  toggleListItem,
  saveMessage,
  displayMessage,
} from "./utils.js";

export const userJoins = ({ id, name }) => {
  toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
  console.log(`${name} connected`);
};

export const userLeaves = ({ id, name }) => {
  toggleListItem({ id, innerHTML: name, add: false }, "user-bar");
  console.log(`${name} disconnected`);
  toggleListItem({ id, innerHTML: name, add: false }, "status-bar");
};

export const userIsWriting = ({ id, innerHTML, add }) => {
  toggleListItem({ id: `status-${id}`, innerHTML, add }, "status-bar");
};

export const writeMessage = (message) => {
  saveMessage(message);
  displayMessage(message);
  window.scrollTo(0, document.body.scrollHeight);
};

export const updateUserData = ({ id, oldName, name }) => {
  updateMessages({ oldName, name });
  if (contains("user-bar", id) && nameChange("user-bar", { id, name })) {
    toggleListItem({ id, innerHTML: name, add: false }, "user-bar");
    toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
    return;
  } else if (contains("user-bar", id)) return;
  toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
};
