import {
  displayMessage,
  toggleListItem,
  contains,
  nameChange,
  isUnique,
  updateMessages,
  getUniqueId,
  getUniqueName,
  saveMessage,
  resize,
} from "./helpers.js";

const socket = io();
const form = document.getElementsByTagName("form")[0];
const message = document.getElementById("message");
const name = document.getElementById("username");
const id = getUniqueId();
let oldName = getUniqueName();
name.value = oldName;
socket.emit("JOIN", { id, name: name.value });
socket.emit("USER_DATA", { id, name: name.value });
const savedMessages = sessionStorage.getItem("messages");
if (savedMessages) {
  JSON.parse(savedMessages).forEach((message) => displayMessage(message));
}

name.addEventListener("focus", (e) => {
  e.preventDefault();
  if (e.target.value) {
    oldName = e.target.value;
  }
});

name.addEventListener("blur", (e) => {
  e.preventDefault();
  if (
    e.target.value &&
    e.target.value !== oldName &&
    isUnique(e.target.value)
  ) {
    updateMessages({ oldName, name: name.value });
    socket.emit("USER_DATA", { id, oldName, name: e.target.value });
    sessionStorage.setItem("user-name", name.value);
  } else {
    name.value = oldName;
  }
});

form.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    if (message.value) {
      const currentUserMessage = {
        time: new Date(),
        message: message.value,
        className: "currentUser",
      };
      displayMessage(currentUserMessage);
      saveMessage(currentUserMessage);
      socket.emit("MESSAGE", {
        user: name.value,
        time: new Date(),
        message: message.value,
      });
      message.value = "";
      window.scrollTo(0, document.body.scrollHeight);
    }
  },
  false
);

message.addEventListener("keyup", (e) => {
  e.preventDefault();
  resize(e.target);
});

message.addEventListener("focus", (e) => {
  e.preventDefault();
  resize(e.target);
  socket.emit("WRITING", { id, innerHTML: `${name.value}...`, add: true });
});
message.addEventListener("blur", (e) => {
  e.preventDefault();
  socket.emit("WRITING", { id, innerHTML: `${name.value}...`, add: false });
  e.target.rows = 1;
});

socket.on("JOIN", ({ id, name }) => {
  toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
  console.log(`${name} connected`);
});
socket.on("REPORT_REQUEST", () => {
  socket.emit("USER_DATA", { id, name: name.value });
});
socket.on("USER_DATA", ({ id, oldName, name }) => {
  updateMessages({ oldName, name });
  if (contains("user-bar", id) && nameChange("user-bar", { id, name })) {
    toggleListItem({ id, innerHTML: name, add: false }, "user-bar");
    toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
    return;
  } else if (contains("user-bar", id)) return;
  toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
});
socket.on("LEAVE", ({ id, name }) => {
  toggleListItem({ id, innerHTML: name, add: false }, "user-bar");
  console.log(`${name} disconnected`);
  toggleListItem({ id, innerHTML: name, add: false }, "status-bar");
});
window.addEventListener("beforeunload", (e) => {
  socket.emit("LEAVE", { id, name: name.value });
  delete e["returnValue"];
});

socket.on("MESSAGE", (message) => {
  saveMessage(message);
  displayMessage(message);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("WRITING", ({ id, innerHTML, add }) => {
  toggleListItem({ id: `status-${id}`, innerHTML, add }, "status-bar");
});
