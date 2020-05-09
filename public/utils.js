import {
  displayMessage,
  toggleListItem,
  contains,
  nameChange,
  isUnique,
  updateMessages,
  getUniqueId,
  getUniqueName,
} from "./helpers.js";

const socket = io();
const form = document.getElementsByTagName("form")[0];
const message = document.getElementById("message");
const name = document.getElementById("username");
const id = getUniqueId();
console.log({ id });
let oldName = getUniqueName();
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
      displayMessage({
        time: new Date(),
        message: message.value,
        className: "currentUser",
      });
      socket.emit("MESSAGE", {
        user: name.value,
        time: new Date(),
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
// window.onbeforeunload = () => {
//   socket.emit("LEAVE", { id, name: name.value });
// };
window.addEventListener("beforeunload", (e) => {
  // the absence of a returnValue property on the event will guarantee the browser unload happens
  socket.emit("LEAVE", { id, name: name.value });
  delete e["returnValue"];
});

socket.on("MESSAGE", displayMessage);

socket.on("WRITING", ({ id, innerHTML, add }) => {
  toggleListItem({ id: `status-${id}`, innerHTML, add }, "status-bar");
});
