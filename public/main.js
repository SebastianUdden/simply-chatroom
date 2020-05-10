import {
  displayMessage,
  isUnique,
  updateMessages,
  getUniqueId,
  getUniqueName,
  saveMessage,
  resize,
} from "./helpers.js";
import {
  updateUserData,
  userLeaves,
  writeMessage,
  userIsWriting,
  userJoins,
} from "./socketHelpers.js";

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
  setTimeout(() => {
    e.target.rows = 1;
  }, 100);
});
socket.on("REPORT_REQUEST", () => {
  socket.emit("USER_DATA", { id, name: name.value });
});

socket.on("JOIN", userJoins);
socket.on("USER_DATA", updateUserData);
socket.on("LEAVE", userLeaves);
socket.on("MESSAGE", writeMessage);
socket.on("WRITING", userIsWriting);

window.addEventListener("beforeunload", (e) => {
  socket.emit("LEAVE", { id, name: name.value });
  delete e["returnValue"];
});
