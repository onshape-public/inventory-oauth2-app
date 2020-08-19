### **Development**
#### ***Assumption***
Nodejs and Npm should be installed.

#### ***Running on local***
1. Clone this github repo on local.
2. Run below command to install npm dependencies
    $ npm install
3. Set environment variables for ADMINUSERNAME and ADMINUSERPASSWORD. This will be used to create admin user
    $ export ADMINUSERNAME=<username>
    $ export ADMINUSERPASSWORD=<password>
4. Run the application with below command
    $ node server.js
5. Open browser for `http://localhost:3000/api` url, if browser shows below content in window, applications started successfully.
    $ {"message":"You are running inventory application!"}
6. Make POST api call to `http://localhost:3000/api/users/create-admin-user` (You can use postman). It will create admin user with username/password from step 3.
7. Create application by making POST call to `http://localhost:3000/api/applications` with post body. This keys will be used for oauth from onshape.
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
    $ heroku config:set ENVIRONMENT=production
    $ git push heroku master

### **Reference Documentation**
#### ***Heroku***
For more information about using Node.js on Heroku, see these Dev Center articles:

 -  [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
 -  [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
 -  [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)

#### ***OAuth***
Onshape uses standard OAuth2.
 - [See the RFC for a detailed description of OAuth](https://tools.ietf.org/html/rfc6749)
 - [Digital Ocean provides a nice tutorial on using OAuth](https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2)