# Disco-ord

## Api Documentation

## USER AUTHENTICATION/AUTHORIZATION

### All endpoints that require authentication

All endpoints that require a current user to be logged in.

- Request: endpoints that require authentication
- Error Response: Require authentication

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Authentication required",
      "statusCode": 401
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

- Request: endpoints that require proper authorization
- Error Response: Require proper authorization

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Forbidden",
      "statusCode": 403
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

- Require Authentication: true
- Request

  - Method: GET
  - URL: /api/session
  - Body: none

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith"
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

- Require Authentication: false
- Request

  - Method: POST
  - URL: /api/session
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "token": ""
    }
    ```

- Error Response: Invalid credentials

  - Status Code: 401
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Invalid credentials",
      "statusCode": 401
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

- Require Authentication: false
- Request

  - Method: POST
  - URL: /api/users
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "username": "JohnSmith",
      "email": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- Successful Response

  - Status Code: 200
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Smith",
      "username": "JohnSmith",
      "email": "john.smith@gmail.com",
      "token": ""
    }
    ```

- Error response: User already exists with the specified email

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "statusCode": 403,
      "errors": {
        "email": "User with that email already exists"
      }
    }
    ```

- Error response: User already exists with the specified username

  - Status Code: 403
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "User already exists",
      "statusCode": 403,
      "errors": {
        "username": "User with that username already exists"
      }
    }
    ```

- Error response: Body validation errors

  - Status Code: 400
  - Headers:
    - Content-Type: application/json
  - Body:

    ```json
    {
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

## SERVERS

### Add User by user_id

Posts new User to server_members

* Require Authentication: True
* Request
  * Method: POST
  * URL: /api/servers/:server_id/members
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "user_id": 1
    }
    ```

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
        "id": 1,
        "user_id": 1,
        "server_id": 1
    }
    ```

* Error response: Couldn't find an User with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User couldn't be found",
      "statusCode": 404
    }
    ```

* Error response: User is already member
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User is already a member!",
      "statusCode": 401
    }
    ```

* Error response: Couldn't find an Server with specified Id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "server couldn't be found",
      "statusCode": 404
    }
    ```

* Error response: Current user is not server owner
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "You don't have access to add members to this server",
      "statusCode": 403
    }
    ```


### Remove a User from a Server by Id

* Require Authentication: True
* Request
  * Method: DELETE
  * URL: /api/servers/:server_id/members/:member_id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted",
      "statusCode": 200
    }
    ```

* Error response: Couldn't find an User with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User couldn't be found",
      "statusCode": 404
    }
    ```

* Error response: Couldn't find an Server with specified Id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "server couldn't be found",
      "statusCode": 404
    }
    ```

* Error response: Current user is not server owner
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "You don't have access to delete members to this server",
      "statusCode": 403
    }
    ```

### Get Servers by Current User
Returns all the servers created by the specified artist.

* Require Authentication: True
* Request
  * Method: GET
  * URL: /api/servers/current
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Servers": [
        {
          "id": 1,
          "name": "The Odyssey",
          "private": false,
          "imageUrl": "image url"
        }
      ]
    }
    ```

### Get all Public Servers
Returns all of the public serves

* Require Authentication: False
* Request
  * Method: GET
  * URL: /api/servers/public
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Servers": [
        {
          "id": 1,
          "name": "The Odyssey",
          "private": true,
          "imageUrl": "image url"
        }
      ]
    }
    ```
### Create a Server
Creates a new server

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/servers
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "The Odyssey",
      "imageUrl": "image url"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "adminId": 1,
      "name": "The Odyssey",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
      "imageUrl": "image url"
    }
    ```

* Error Response: Body validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {
        "name": "Server name is required"
      }
    }
    ```

### Edit a Server
Updates and returns an existing server.

* Require Authentication: true
* Require proper authorization: server must belong to the current user
* Request
  * Method: PUT
  * URL: /api/servers/:server_id
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "Not the Odyssey",
      "imageUrl": "image url"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "userId": 1,
      "name": "Not the Odyssey",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 20:00:00",
      "imageUrl": "image url"
    }
    ```

* Error Response: Body validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {
        "name": "Server name is required"
      }
    }
    ```

* Error response: Couldn't find a Server with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Server couldn't be found",
      "statusCode": 404
    }
    ```

### Delete a Server

Deletes an existing server.

* Require Authentication: true
* Require proper authorization: Server must belong to the current user
* Request
  * Method: DELETE
  * URL: /api/servers/:server_id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted",
      "statusCode": 200
    }
    ```

* Error response: Couldn't find a Server with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Server couldn't be found",
      "statusCode": 404
    }
    ```

## CHANNELS

### Get Details of Channel by Id

Returns the details of a channel specified by their id.

* Require Authentication: false
* Request
  * Method: GET
  * URL: /api/channel/:channel_id
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "name": "channel name",
      "server_id": 1
    }
    ```

* Error response: Couldn't find a channel with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Channel couldn't be found",
      "statusCode": 404
    }
    ```

### Create a channel
Creates a new channel

* Require Authentication: true
* Request
  * Method: POST
  * URL: /api/servers/:server_id/channels
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "Groovin' Dancefloor",
      "imageUrl": "image url"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "name": "Groovin' Dancefloor",
      "server_id": 1
    }
    ```

* Error Response: Body validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Validation Error",
      "statusCode": 400,
      "errors": {
        "name": "Channel name is required"
      }
    }
    ```

* Error Response: Server couldn't be found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Server couldn't be found",
      "statusCode": 404
    }
    ```

### Update Channel Details by id
* Require Auth: true
* Request:
  * Method: PUT
  * URL: /api/channels/:channel_id
  * Body:
    ```json
      {
        "name": "Channel name",
        "serverId": 1,
     }
    ```

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
      {
        "id": 1,
        "name": "Channel name",
        "serverId": 1,
      }
    ```

* Error Response: Couldn’t find channel with specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
    ```json
    {
      "message": "Channel couldn’t be found",
      "statusCode": 404
    }
    ```

* Error Response: Body validation error
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "name": "Channel name is required",
    		"server": "Server must be specified"
  	  }
    }
  ```

### Get all channels by server id
* Require Auth: true
* Request:
  * Method: GET
  * URL: /api/servers/:server_id/channels
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "Channels": [
        {
          "id": 1,
          "name": "channel name",
          "serverId": 1,
        }
      ]
    }
  ```

* Error Response: Server with specified id could not be found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "message": "Server couldn’t be found",
      "statusCode": 404
    }
  ```

### Delete a Channel
* Require Auth: true
* Request:
  * Method: DELETE
  * URL: /api/channels/:channel_id
  * Body: none

* Successful Response:
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "message": "Successfully deleted",
      "statusCode": 200
    }
  ```

* Error Response: Channel with specified id could not be found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "message": "Channel couldn’t be found",
      "statusCode": 404
    }
  ```

### CHANNEL-MESSAGES

### Get all messages by channel id
* Request:
  * Method: GET
  * URL = ‘/api/channel/:channel_id/
  * Body: none

* Successful Response:
  * Status Code: 200
  * Response:
    ```json
    {
      "Messages": [
        {
          "id": 1,
          "user_id": 1,
          "body": "Woohoo! This makes me feel like dancing!"
        }
      ]
    }
    ```

* Error Response: Server with specified id could not be found
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {
      "message": "Server couldn’t be found",
      "statusCode": 404
    }
  ```

### Delete message by id
* Request:
  * Method: DELETE
  * URL = ‘api/channel/message/message_id
  * Body: none

* Successful Response:
  * Status Code: 200
  * Body:
  ```json
    {
	    "message": "Message successfully Deleted"
    }
  ```
* Error Response:
  * Status Code: 404
  * Body:
  ```json
    {
      "message":"Error Message Not Deleted"
    }

### Post new message
* Request:
  * Method: POST
  * URL = api/channel/:channel_id/message
  * Body:
  ```json
    {
	    "id": 1,
	    "user_id": 1,
	    "channel_id": 1,
	    "body": "Woohoo! This makes me feel like dancing!",
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 20:00:00",
    }
  ```

* Successful Response:
  * Status Code: 200
  * Body:
  ```json
    {
      "id": 1,
	    "userId": 1,
	    "channelId": 1,
	    "body": "Woohoo! This makes me feel like dancing!",
	    "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-20 20:00:00"
    }
  ```

* Error Response:
  * Status Code: 404
  * Body:
  ```json
    {"message":"Error Message Not Created"}
  ```

