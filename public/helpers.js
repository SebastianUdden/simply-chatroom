import uuid from "./uuid.js";

export const resize = (textarea) => {
  const maxrows = 10;
  const textArray = textarea.value.split("\n");
  let rows = textArray.length;

  for (let i = 0; i < textArray.length; i++)
    rows += parseInt(textArray[i].length / textarea.cols);

  if (rows > maxrows) textarea.rows = maxrows;
  else textarea.rows = rows;
};

export const getUniqueName = () => {
  let name = sessionStorage.getItem("user-name");
  if (name) {
    return name;
  }
  name = `User ${Math.round(Math.random() * 100)}${Math.round(
    Math.random() * 100
  )}`;
  sessionStorage.setItem("user-name", name);
  return name;
};
export const getUniqueId = () => {
  let id = sessionStorage.getItem("user-id");
  if (id) {
    return id;
  }
  id = uuid();
  sessionStorage.setItem("user-id", id);
  return id;
};

export const updateMessages = ({ oldName, name }) => {
  const htmlCollection = document.getElementById("messages").children;
  const messages = [].slice.call(htmlCollection);
  messages.forEach((message) => {
    const div = message.children[0];
    const userSpan = div.children[0].children[0];
    if (userSpan.innerHTML === oldName) {
      userSpan.innerHTML = name;
    }
  });
};

export const contains = (listId, id) => {
  const list = document.getElementById(listId);
  return list.children[id] ? true : false;
};

export const nameChange = (listId, { id, name }) => {
  const list = document.getElementById(listId);
  if (list.children[id]) {
    return list.children[id].innerHTML !== name;
  }
  return false;
};

const formatDate = (t) => {
  const time = new Date(t);
  return `${time.getHours()}:${
    (time.getMinutes() < 10 ? "0" : "") + time.getMinutes()
  }`;
};

const setSpan = (p, innerHTML) => {
  const span = document.createElement("SPAN");
  span.innerHTML = innerHTML;
  p.appendChild(span);
};

export const saveMessage = (message) => {
  const messages = sessionStorage.getItem("messages");
  let messagesArray = [];
  if (messages) {
    messagesArray = JSON.parse(messages);
  }
  messagesArray.push(message);
  sessionStorage.setItem("messages", JSON.stringify(messagesArray));
};

export const displayMessage = ({ user, time, message, className }) => {
  const messages = document.getElementById("messages");
  const li = document.createElement("LI");
  if (user || time) {
    const div = document.createElement("DIV");
    div.className = "message";
    const metaP = document.createElement("P");
    if (user) setSpan(metaP, user);
    if (time) setSpan(metaP, formatDate(time));
    metaP.className = "meta";
    div.appendChild(metaP);
    const messageP = document.createElement("P");
    messageP.innerHTML = message;
    div.appendChild(messageP);
    li.appendChild(div);
  } else {
    li.innerHTML = message;
  }
  if (className) {
    li.className = className;
  }
  messages.appendChild(li);
};

export const addToList = ({ id, innerHTML }, listId) => {
  const list = document.getElementById(listId);
  const li = document.createElement("LI");
  li.id = id;
  li.innerHTML = innerHTML;
  list.appendChild(li);
};

export const removeFromList = ({ id }, listId) => {
  const list = document.getElementById(listId);
  const li = document.getElementById(id);
  list.removeChild(li);
};

export const toggleListItem = (user, list) =>
  user.add ? addToList(user, list) : removeFromList(user, list);

export const isUnique = (name) => {
  const htmlCollection = document.getElementById("user-bar").children;
  const users = [].slice.call(htmlCollection);
  const equal = users.find((li) => li.innerHTML === name);
  return !equal;
};
