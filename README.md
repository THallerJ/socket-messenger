# Socket Messenger

## Description

Socket Messenger is a simple messaging web app.

_Note: The app is currently not deployed due to heroku removing free postgres integration_

## Development

Socket Messenger uses a React client and an Express server. The server communicates with each client by using sockets, which is done through [Socket.IO](https://github.com/socketio/socket.io#readme). When a user opens the client, the client creates a socket connection with the server. On the server, the socket connection with each client is mapped to that client's ID, allowing the server to communicate with any client.

When a user sends a message to another user/users, the client sends a message object containing the message along with the user ID of the message's recipients to the server. The server then attempts to find a socket connection that maps to each of the message's recipients to send the message to the appropriate client/clients.

When the server receives a message from the client, it also saves the contents of the message object to a PostgreSQL database. This handles the case that occurs when a message recipient doesn't have a socket connection with the server, meaning the server is unable to send the message to the client. When--or if--a socket connection is established, the server can query the database for messages that were intended for the client and send them. When the client receives a message, it then sends a success response to the server, alerting the server that it can delete the message from the database.

An example of a conversation in the app is depicted below:
![capture](https://user-images.githubusercontent.com/26337084/182067580-7c49146e-be81-4cca-98c4-428986ad861b.png)
