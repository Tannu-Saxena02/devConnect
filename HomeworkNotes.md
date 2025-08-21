- Create a repository -  ✅ Done Project Related
- Initialise the repository -  ✅ Done Project Related
- node modules,package.json,package-lock.json
- Install express -  ✅ Done Project Related
- Create a server -  ✅ Done Project Related
- Listen to port 7777 -  ✅ Done Project Related
- Write request handlers for /test,/hello-  ✅ Done Project Related(check vscode)
- Install nodemon and update scripts inside package.json : https://chatgpt.com/c/68a59b48-3004-832b-91a6-7a2d80902b5e
- What are dependencies: https://chatgpt.com/c/68a59b48-3004-832b-91a6-7a2d80902b5e
- #### What is the use of "-g" while npm install
The `-g` flag stands for **global install**. It determines where the package is installed and how it can be accessed.

#### Without `-g` (local install):
- Installs the package inside your project’s `node_modules` folder.  
- Accessible only within that specific project.  
- Can be added to your `package.json` (using `--save` or `--save-dev`).  

#### With `-g` (global install):
- Installs the package in a central location on your system (outside of the project).  
- Makes the package’s binaries/commands available system-wide in the terminal/command line.  



Useful for tools you want to run from anywhere (e.g., nodemon, npm, create-react-app, typescript, etc.).
- Difference between caret and tilde (^ and ~)
https://chatgpt.com/c/68a58b1c-4980-8321-aa91-e3b8a93e6003
- initialise git-  ✅ Done Project Related
- gitignore-  ✅ Done Project Related
- create a remote repo on github-  ✅ Done Project Related
- Push all code to remote origin-  ✅ Done Project Related
- Play with routes and routes extensions ex /hello,  /, /hello/2 , /xyz-  ✅ Done Project Related(check vscode)
- Orders of the route matters a lot-  ✅ Done Project Related(check vscode)
- Install postman app and make a workspace/Collection test API call. - ✅ Done Project Related
- http method- GET,POST,PUT,DELETE,PATCH and other and types of APIS REST, graphQL etc and http status code
- HTTP Method: https://www.w3schools.com/tags/ref_httpmethods.asp
- Difference between PUT and Patch- RN Notes
- Http Status code: https://www.geeksforgeeks.org/blogs/10-most-common-http-status-codes/
- GraphQl & REST :https://medium.com/@elijahbanjo/understanding-graphql-apis-from-a-rest-api-point-of-view-08196600c667
- Different types of APIS SOAP vs REST vs GraphQL : https://www.freecodecamp.org/news/rest-vs-graphql-apis/
  
- Types of APIS:Based on Architecture / Style
  
  REST (Representational State Transfer)
  
  SOAP (Simple Object Access Protocol)
  
  GraphQL

  gRPC (Google Remote Procedure Call) :https://chatgpt.com/c/68a5951c-7958-8331-a0e8-1bdb7800d79c
- write logic to handle GET,POST,PATCH,DELETE APIS calls and test them on POSTMAN.
- Explore routing and use of ?,+,(),* in the routes.: https://chatgpt.com/c/68a5acd3-8a90-832e-8aa9-f8294c1a0986
- Use of regex /a/, /*fly$/ : https://chatgpt.com/c/68a5acd3-8a90-832e-8aa9-f8294c1a0986
- Reading the query params in the route - ✅ check Vscode
- Reading the dynamic route : https://stackoverflow.com/questions/25623041/how-to-configure-dynamic-routes-with-express-js

- Multiple route handlers - Play with the code - ✅ Done Project Related(check Vscode)
- next() - ✅ Done Project Related(check vscode)
- next function and errors along with res.send()✅ Done Project Related(check vscode)
- app.use("/route",r1,[r2,r3],r4,r5) : https://chatgpt.com/c/68a59e87-e444-832e-a6dd-73b993bdb0bd
- What is middleware- NodeJs notes
- How express js basically handles requests behind the scenes : https://chatgpt.com/c/68a59e87-e444-832e-a6dd-73b993bdb0bd
- Difference between app.use and app.all : https://chatgpt.com/c/68a59e87-e444-832e-a6dd-73b993bdb0bd
- write a dummy auth middleware for admin - ✅ Done Project Related (check vscode)
- Write a dummy auth middleware for all user routes except /user/login  - ✅ Done Project Related(check vscode)
- Error handling app.use("/",(err,req,res,next)={});✅ Done Project Related(check vscode)

- Create a free cluster on mongodb official website(Mongo Atlas) - ✅ Done Project Related
- Install mongoose library - ✅ Done Project Related
- Connect your application to the database "Connection-url"/devTinder - ✅ Done Project Related
- Call the connectDB function and connect to database before starting application to 7777 - ✅ Done Project Related
- Create a userSchema & userModel : http://chatgpt.com/c/68a6b990-9a0c-832e-8aae-193affb1f847
- Create a POST /signup API to add data to database - ✅ Done Project Related
- Push some documents using API calls from POSTMAN - ✅ Done Project Related
- Error handling using try and catch - ✅ Done Project Related

- difference between js objects and JSON : https://www.geeksforgeeks.org/javascript/json-vs-javascript-object/
- Add the express.json middleware to your app - ✅ Done Project Related
- make your sign up API dynamic to receive data from the end user. - ✅ Done Project Related
- User.findOne with duplicate email,ids which object returned :https://mongoosejs.com/docs/documents.html#retrieving
- CMD: https://mongoosejs.com/docs/queries.html & https://chatgpt.com/c/68a6c2fc-87f8-8325-aa1b-8e66a34ae96f
  
- API get user by email - ✅ Done Project Related
- API -Feed API-GET/feed - get all the users from the database - ✅ Done Project Related
- API get user by id - ✅ Done Project Related
- Create a delete user API - ✅ Done Project Related
- Difference between PUT and PATCH - RN notes
- API -Update a user - ✅ Done Project Related
- Explore the mongoose Documention for models method - ✅ Done Project Related
- What are the options in a model.findOneAndUpdate method,explore more about it. - ✅ Done Project Related
- API update the user by emailID. - ✅ Done Project Related

- Explore schemaType options from the document : https://mongoosejs.com/docs/schematypes.html
- add required,unique,lowercase,min,maxLength,trim - ✅ Done Project Related
- Add default in schema - ✅ Done Project Related
- Create a custom validate function for gender - ✅ Done Project Related
- Improve the db schema - Put all approate validations on each field in schema - ✅ Done Project Related
- Add timestamps to the user Schema - ✅ Done Project Related
- Add api level validation on PATCH request signup POST API - ✅ Done Project Related
- Data sanitizing - Add API validation for each field - ✅ Done Project Related
- Install validator - ✅ Done Project Related
- Explore validator library function and use validator functs for password,email,URL - ✅ Done Project Related
- NEVER TRUST req.body  - ✅ Done Project Related

- Validate data in signup API - ✅ Done Project Related
- Install bcrypt package : https://www.geeksforgeeks.org/node-js/npm-bcrypt/
- Create passwordHash using bcrypt.hash & save the user in excrupted password - ✅ Done Project Related
- Create login API - ✅ Done Project Related
- Compare password and throw errors if email or password is invalid. - ✅ Done Project Related

- Install cookies - ✅ Done Project Related
- just send a dummy cookie to user - ✅ Done Project Related
- Create GET /profile API and check if you get the cookie back - ✅ Done Project Related
- Install jsonwebtoken - ✅ Done Project Related
- In login API,after email and password validation,create a JWT token and send it to user in cookies - ✅ Done Project Related
- read the cookies inside your profile API and find the loggedin user - ✅ Done Project Related
- userAuth middleware - ✅ Done Project Related
- add the userAuth middleware in profile and a new sendConnectionRequest API - ✅ Done Project Related
- set the expiry of JWT token and cookies to 7 days and disadvantage of not expiry the token or cookie when we login in cybercafe others computers: https://chatgpt.com/c/68a6b063-90bc-8332-98d0-4e214147445a
- Create userSchema method to create JWT - ✅ Done Project Related
- Create userschema method to compare password - ✅ Done Project Related

- Explore tinder APIS
- Create a list of all API you can think of in DEV TINDER
- Group multiple routes under respective routers. - ✅ Done Project Related
- Read documentation for Express.Router : https://expressjs.com/en/guide/routing.html
- Create route folfer for managing auth,profile,request routers - ✅ Done Project Related
- Create authRouter,profileRouter,requestRouter - ✅ Done Project Related
- Import these router in app.js - ✅ Done Project Related
- Create POST/logout api - ✅ Done Project Related
- Create PATCH/profile/edit - ✅ Done Project Related
- Create PATCH/profile/password API => forgot password API - ✅ Done Project Related
- Make sure you validate all the data in every POST,PATCH APIs - ✅ Done Project Related

- Create connection Request Schema - ✅ Done Project Related
- Send Connection Request API - ✅ Done Project Related
- Proper validation of Data - ✅ Done Project Related
- Think about all corner cases
- $or and $and query in mongoose:https://www.mongodb.com/docs/manual/reference/operator/query/or/
- schema.pre("save function") : https://mongoosejs.com/docs/api/schema.html#Schema.prototype.pre()
- Read more about indexes in mongodb : https://medium.com/@rtawadrous/introduction-to-database-indexes-9b488e243cc1
- Why do we want index in mongodb? : https://medium.com/@rtawadrous/introduction-to-database-indexes-9b488e243cc1
- What is the advantages and disadvantages of creating indexing? : https://medium.com/@rtawadrous/introduction-to-database-indexes-9b488e243cc1
- Read this article about compound indexes-https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/
- ALWAYS THINK ABOUT CORNER CASES.

- Write code with proper validation for POST /request/review/:status:/reuqestId - ✅ Done Project Related
- Thought Process -POST VS GET :https://www.geeksforgeeks.org/php/difference-between-http-get-and-post-methods/
- Read about ref and populate : https://mongoosejs.com/docs/populate.html
- Create GET /user/request/received with all the checks  - ✅ Done Project Related
- Create GET /user/connections  - ✅ Done Project Related

- Logic for GET /feed API - ✅ Done Project Related
- Explore the $nin(not in array),$and , $ne(not equal to) and other query operators : https://www.mongodb.com/docs/manual/reference/operator/query/nin/
- pagination

- Manage multiple environement (how we do it for local & production in single repo): https://www.npmjs.com/package/dotenv
- Socket & websockets(socket.io) & webRtc : https://www.geeksforgeeks.org/system-design/differences-between-websocket-and-webrtc-in-system-design/
   https://chatgpt.com/c/68a6f2c9-3904-8320-be18-a36d0610fd6a and check notes
- How we implement websocket in devTinder
- Read Frontend readme of devTInder

NOTES
/feed?page=1&limit=10 =>1-10 => .skip(0) & .limit(10)
/feed?page=2&limit=10 =>11-20 => .skip(10) & .limit(10)
/feed?page=3&limit=10 =>21-30 => .skip(20) & .limit(10)
/feed?page=4&limit=10 =>31-40 => .skip(30) & .limit(10)
 so skip=(page-1)*limit
