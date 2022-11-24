# Bike-Application-project
## About - A web application for bike service station
## Framework
  * Backend  - **Node.js, Express.js** 
  * Frontend - **HTML, CSS, EJS**
  * Database - **Firebase (Real-time-database, Authentication)**
## Working Details - _[Bike-Application-project/Output_screenshots](https://github.com/JacksonStuwart/Bike-Application-project/blob/master/Output_screenshots/)_
 * ### Customer
    * After a successfull Login/Registration Customer is redirected to Home Page, Where he can book his appointment to the service station
    * After filling Booking details form a alert mail is sent to both the customer and owner/service station 
    * The customers order History and pending order details can be viewed at **Customer Details** section in Home page
 * ### Service Station
    * Owner has a separate Webpage where it has two cards of **Edit Details** and **View Details** 
    * **Edit Details** card directs to the webpage of the **Pending Orders and Order History of all the customers** 
    * **View Details** card directs to the webpage where it has all the **customer details _(EX : name, number, email,address etc)_**
## Usage
 ### Run Commands
   * **npm install** - _(installs all the required dependencies)_
   * **node index.js** - _(server runs at **localhost:5000** )_
 ### Login credentials
   * E-Mail - johnbiker555#gmail.com Password - **biker555**  _(This gives access to Owner/Service Station WebPage)_ .
   * To get Logged into as customer you can simply register a new account .
 ### Note
   * **Firebase SDK** values are not provided in **.env** file .
   * You cannot login and use the application without Firebase SDK .
   * You could get you own Firebase SDK at **[Firebase](https://firebase.google.com/)** by creating a new project in it .
   * You should create **authentication service** at firebase for Owner Login ie : set email and password _( EX : E-Mail - johnbiker555#gmail.com Password - **biker555** )_  .

