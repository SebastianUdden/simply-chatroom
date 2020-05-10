import {
  updateMessages,
  displayMessage,
  saveMessage,
  resize,
  isUnique,
} from "./utils.js";
import { emit, username, oldName } from "./main.js";

const form = document.getElementsByTagName("form")[0];
const message = document.getElementById("message");

username.addEventListener("focus", (e) => {
  e.preventDefault();
  if (e.target.value) {
    oldName = e.target.value;
  }
});

username.addEventListener("blur", (e) => {
  e.preventDefault();

  const name = e.target.value;
  const validName = name && name !== oldName && isUnique(name);

  if (validName) {
    updateMessages({ oldName, name });
    emit("USER_DATA", { oldName, name: username.value });
    sessionStorage.setItem("user-name", username.value);
  } else {
    username.value = oldName;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!message.value) return;

  const userMessage = {
    time: new Date(),
    message: message.value,
  };
  displayMessage({ ...userMessage, className: "currentUser" });
  saveMessage({ ...userMessage, className: "currentUser" });
  emit("MESSAGE", {
    ...userMessage,
    user: username.value,
  });
  message.value = "";
  window.scrollTo(0, document.body.scrollHeight);
});

message.addEventListener("keyup", (e) => {
  e.preventDefault();
  resize(e.target);
});
message.addEventListener("focus", (e) => {
  e.preventDefault();
  resize(e.target);
  emit("WRITING", { innerHTML: `${username.value}...`, add: true });
});
message.addEventListener("blur", (e) => {
  e.preventDefault();
  setTimeout(() => {
    e.target.rows = 1;
  }, 100);
  emit("WRITING", { innerHTML: `${username.value}...`, add: false });
});

window.addEventListener("beforeunload", (e) => {
  emit("LEAVE", { name: username.value });
  delete e["returnValue"];
});
