export function topicRoomName(topic) {
  return `topic:${topic.toLowerCase().trim()}`;
}

export function categoryRoomName(category) {
  return `category:${category.toLowerCase().trim()}`;
}

export function joinTopicRoom(socket, topic) {
  const room = topicRoomName(topic);
  socket.join(room);
  return room;
}

export function joinCategoryRoom(socket, category) {
  const room = categoryRoomName(category);
  socket.join(room);
  return room;
}

export function leaveTopicRoom(socket, topic) {
  const room = topicRoomName(topic);
  socket.leave(room);
  return room;
}

export function leaveCategoryRoom(socket, category) {
  const room = categoryRoomName(category);
  socket.leave(room);
  return room;
}

export function getSubscribedTopics(io) {
  const topics = new Set();
  for (const [roomName] of io.sockets.adapter.rooms) {
    if (roomName.startsWith('topic:')) {
      topics.add(roomName.replace('topic:', ''));
    }
  }
  return topics;
}
