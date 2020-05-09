import uuidv4 from "./uuid.js";
import {
  displayMessage,
  toggleListItem,
  contains,
  nameChange,
  isUnique,
} from "./helpers.js";

const socket = io();
const form = document.getElementsByTagName("form")[0];
const message = document.getElementById("message");
const name = document.getElementById("username");
const id = uuidv4();
let oldName = `User ${Math.round(Math.random() * 100)}${Math.round(
  Math.random() * 100
)}`;
name.value = oldName;
socket.emit("JOIN", { id, name: name.value });
socket.emit("USER_DATA", { id, name: name.value });

name.addEventListener("focus", (e) => {
  e.preventDefault();
  if (e.target.value) {
    oldName = e.target.value;
  }
});

name.addEventListener("blur", (e) => {
  e.preventDefault();
  console.log("Blur");
  if (
    e.target.value &&
    e.target.value !== oldName &&
    isUnique(e.target.value)
  ) {
    socket.emit("USER_DATA", { id, name: e.target.value });
  } else {
    name.value = oldName;
  }
});

form.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    if (message.value) {
      displayMessage({ message: `${name.value}: ${message.value}` });
      socket.emit("MESSAGE", {
        user: name.value,
        message: message.value,
      });
      message.value = "";
    }
  },
  false
);

message.addEventListener("focus", (e) => {
  e.preventDefault();
  socket.emit("WRITING", { id, innerHTML: `${name.value}...`, add: true });
});
message.addEventListener("blur", (e) => {
  e.preventDefault();
  socket.emit("WRITING", { id, innerHTML: `${name.value}...`, add: false });
});

socket.on("JOIN", ({ id, name }) => {
  toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
  displayMessage({ message: `${name} connected`, className: "status" });
});
socket.on("REPORT_REQUEST", () => {
  socket.emit("USER_DATA", { id, name: name.value });
});
socket.on("USER_DATA", ({ id, name }) => {
  if (contains("user-bar", id) && nameChange("user-bar", { id, name })) {
    toggleListItem({ id, innerHTML: name, add: false }, "user-bar");
    toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
    return;
  } else if (contains("user-bar", id)) return;
  toggleListItem({ id, innerHTML: name, add: true }, "user-bar");
});
socket.on("LEAVE", ({ id, name }) => {
  toggleListItem({ id, innerHTML: name, add: false }, "user-bar");
  displayMessage({ message: `${name} disconnected`, className: "error" });
  toggleListItem({ id, innerHTML: name, add: false }, "status-bar");
});
window.onbeforeunload = () => {
  socket.emit("LEAVE", { id, name: name.value });
};

socket.on("MESSAGE", (message) => displayMessage({ message }));

socket.on("WRITING", ({ id, innerHTML, add }) => {
  toggleListItem({ id: `status-${id}`, innerHTML, add }, "status-bar");
});
