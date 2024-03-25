### **Development**

#### **_Assumption_**

Nodejs and Npm should be installed.

#### **_Running on local_**

Clone this github repo on local and run below command to install the dependencies.

    $ npm install

Set environment variables for ADMINUSERNAME and ADMINUSERPASSWORD. This will be used to create admin user

    $ export ADMINUSERNAME=<username>
    $ export ADMINUSERPASSWORD=<password>

Set environment variable TOKENTIMEOUT to set token expiry time in seconds.

    $ export TOKENTIMEOUT=<expiry time in seconds>

Default is 121 seconds. If you want to disable refresh of token, set this value to 0.

Run the application with below command

    $ node server.js

Open browser for `http://localhost:3000/api` url, if browser shows below content in window, applications started successfully.

    $ {"message":"You are running inventory application!"}

Make POST api call to `http://localhost:3000/api/users/create-admin-user` (You can use postman). It will create admin user with username/password from step 3.

Create application by making POST call to `http://localhost:3000/api/applications` with post body. This keys will be used for oauth from onshape.
name:<application-name>
clientId:<client-id>
clientSecret:<client-secret>

### **Deploying to Heroku**

Make sure you have Node.js and the Heroku Toolbelt installed. You will also need a Heroku account [signup is free](https://www.heroku.com/).

Execute the following commands to create a duplicate of a repository; you need to perform both a bare-clone and a mirror-push to a newly-created bare repo (please note that you may want to use SSH instead of HTTPS, depending on your Github settings):

    $ git clone --bare https://github.com/onshape/inventory-oauth2-app.git
       # make a bare clone of the repository

    $ cd inventory-oauth2-app.git
    $ git push --mirror https://github.com/exampleuser/new-respository.git
       # mirror-push to new respository

    $ cd ..
    $ rm -rf inventory-oauth2-app.git
      # remove temporary local repository

##### deploy your repo on heroku

    $ git clone https://github.com/exampleuser/new-respository.git
    $ cd new-repository
    $ heroku create
    $ heroku config:set ADMINUSERNAME=<username>
    $ heroku config:set ADMINUSERPASSWORD=<password>
    $ heroku config:set ENVIRONMENT=production
    $ git push heroku master
      # Ensure that the build pack for the application in the heroku should be `heroku/nodejs`
      # Make sure heroku application has `mLab MongoDB` add-on installed.

##### running the heroku application

Open browser for `http://<heroku-application-url>/api` url, if browser shows below content in window, applications started successfully.

    $ {"message":"You are running inventory application!"}

Create admin user by making POST request to `http://<heroku-application-url>/api/users/create-admin-user` from postman.

Create user with following POST request `https://<heroku-application-url>/api/users` with following body and basic authorization with admin creds created in step

    $ { "username": "<user-name>", "password": "<user-password>" }

Create application by making POST call to `http://<heroku-application-url>/api/applications` with post body. This keys will be used for oauth from onshape.

    $ { "name": "<application-name>", "clientId": "<client-id>", "clientSecret": "<client-secret>" }

You can add these clientId and clientSecret in OAuth tab for the application.

##### **About this code**

- All the api endpoints are in server.js
- Respective controllers are having the logic to get list/individual models
- MongoDB collections get created from the model objects in the `/models` directory

### **Reference Documentation**

#### **_Heroku_**

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)

#### **_OAuth_**

Onshape uses standard OAuth2.

- [See the RFC for a detailed description of OAuth](https://tools.ietf.org/html/rfc6749)
- [Digital Ocean provides a nice tutorial on using OAuth](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2)
