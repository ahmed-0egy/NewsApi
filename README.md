# NewsApi
This project is built with node.js frame work and MongoDB database(using Mongoose package). 
This is a node.js application that's a backend project that creates an API of news and news reporters this project accepts various requests such as 
get, post, patch, and delete. For more information about the project look at the README file.
The project allows reporters to add news and manipulate them where the project consists of two main DB schemas the firt one is called news schema 
that is a schema that stores news title, description, date, the reporter who created it, and an image if availabe. Reporters are only allowed to 
access news data that they added.
The second schema is the reporter schema that stores reporters' name, email, password, age, and phoneNumber. And as mentioned above they can add 
news, update them, delete them, access them, etc.
The two database schema or models are linked together with a relationship called 'news' defined in the reporters.js file where reporter model or
schema holds the news virtually. For the full view of the project functionality run the project on your localhost and take a tour accross the 
application.
