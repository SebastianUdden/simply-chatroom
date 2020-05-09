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

export const displayMessage = ({ message, className }) => {
  const messages = document.getElementById("messages");
  const li = document.createElement("LI");
  li.innerHTML = message;
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
