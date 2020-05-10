import { displayMessage, getUniqueId, getUniqueName } from "./utils.js";
import {
  updateUserData,
  userLeaves,
  writeMessage,
  userIsWriting,
  userJoins,
} from "./socketHelpers.js";

const socket = io();
const id = getUniqueId();
export const emit = (message, data) => socket.emit(message, { id, ...data });
export const username = document.getElementById("username");
export let oldName = getUniqueName();
username.value = oldName;

socket.emit("JOIN", { id, name: username.value });
socket.emit("USER_DATA", { id, name: username.value });

const savedMessages = sessionStorage.getItem("messages");
if (savedMessages) {
  JSON.parse(savedMessages).forEach((message) => displayMessage(message));
}

socket.on("REPORT_REQUEST", () => {
  socket.emit("USER_DATA", { id, name: username.value });
});

socket.on("JOIN", userJoins);
socket.on("LEAVE", userLeaves);
socket.on("MESSAGE", writeMessage);
socket.on("WRITING", userIsWriting);
socket.on("USER_DATA", updateUserData);
