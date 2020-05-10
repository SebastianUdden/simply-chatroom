import { displayMessage, getUniqueId } from "./utils.js";
import {
  updateUserData,
  userLeaves,
  writeMessage,
  userIsWriting,
  userJoins,
} from "./socketHelpers.js";

export const emit = (message, data) => socket.emit(message, { id, ...data });

const socket = io();
const name = document.getElementById("username");
const id = getUniqueId();

socket.emit("JOIN", { id, name: name.value });
socket.emit("USER_DATA", { id, name: name.value });

const savedMessages = sessionStorage.getItem("messages");
if (savedMessages) {
  JSON.parse(savedMessages).forEach((message) => displayMessage(message));
}

socket.on("REPORT_REQUEST", () => {
  socket.emit("USER_DATA", { id, name: name.value });
});

socket.on("JOIN", userJoins);
socket.on("LEAVE", userLeaves);
socket.on("MESSAGE", writeMessage);
socket.on("WRITING", userIsWriting);
socket.on("USER_DATA", updateUserData);
