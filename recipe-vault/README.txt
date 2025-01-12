To make the project work you need to initialize the microservices, the gateway and then the server.

To run it all you need to have installed MongoDB, MySQL, Node.js, Python

First of all open the requirements.txt and download (pip) every dependecy and also follow this commands

en API Gateway
npm install

en user-service
pip install -r requirements.txt

en recipe-service
npm install

en recipe_vault
npm install

To run the webpage:

1. go to user-service folder 
and input "python app.py" in cmd

2. go to recipe-service folder 
and input "node server.js" in cmd

3. go to api-gateway folder
and input "node gateway.js" in cmd

4. in the recipe vault folder
and input "npm start" in cmd with that it will throw a Google webpage with the RecipeVault Webpage.

Default username for the webpage
email: maria@example.com
password: 123456Pass