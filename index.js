   // initialization
   // const nodemailer = require('nodemailer');
   const express = require("express");
   const bodyParser = require("body-parser");
   const fb = require("firebase");
   const alert = require('alert');
   require('dotenv').config()

   const app = express();

   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));

   app.use(express.static("public")); //Helps to apply css to Html page
   app.engine('html', require('ejs').renderFile); //set engine

   //Get's the HTML PAGE

   app.get("/", (req, res) => res.sendFile(__dirname + "/signin.html"));
   app.get("/about", (req, res) => res.sendFile(__dirname + "/about.html"));
   app.get("/home", (req, res) => res.sendFile(__dirname + "/home.html"));
   app.get("/services", (req, res) => res.sendFile(__dirname + "/services.html"));
   app.get("/logout", (req, res) => fb.auth().signOut().then(() => res.sendFile(__dirname + "/signin.html")));
   app.get("/forgotAcc", (req, res) => res.sendFile(__dirname + "/forgotPassword.html"));
   app.get("/notAcc", (req, res) => res.sendFile(__dirname + "/signup.html"));
   app.get("/haveAcc", (req, res) => res.sendFile(__dirname + "/signin.html"));

   //initialize Firebase

   fb.initializeApp({

       apiKey: process.env.APIKEY,
       authDomain: process.env.AUTHDOMAIN,
       databaseURL: process.env.DATABASEURL,
       projectId: process.env.PROJECTID,
       storageBucket: process.env.STORAGEBUCKET,
       messagingSenderId: process.env.MESSAGINGSENDERID,
       appId: process.env.APPID,

   });

   fb.auth.Auth.Persistence.LOCAL; //Firebase auth function for signed in state

   app.post("/login", function(req, res) {

       var email = req.body.email;
       var password = req.body.password;

       if (email != "" && password != "") {

           var result = fb.auth().signInWithEmailAndPassword(email, password)
           result.catch(function(error) {
               alert(error.message)
           })
           fb.auth().onAuthStateChanged(function(user) //checks there is an change in user activity
               {
                   if (user != null) {
                       if (user.email == "johnbiker555@gmail.com") {
                           res.sendFile(__dirname + "/ownerPage.html");
                       } else {
                           res.sendFile(__dirname + "/home.html")
                       }
                   }
               }
           )
       } else {
           alert("Please Fill Out the Fields");
       }
   });

   app.post("/forgotAccValue", function(req, res) {

       var email = req.body.email;
       if (email != "") {
           fb.auth().sendPasswordResetEmail(email).then(() => alert(" Password Reset Link has sent to your Mail "))
               .catch((error) => alert("Message :" + error.message));
       } else {
           alert("Please Fill Out the Fields");
       }
   });

   app.post("/register", function(req, res) {

       var email = req.body.email;
       var password = req.body.password;
       var cpassword = req.body.cpassword;

       if (email != "" && password != "" && cpassword != "") {
           if (password == cpassword) {
               var result = fb.auth().createUserWithEmailAndPassword(email, password); //create user with email and password from user
               result.catch((error) => alert("Message :" + error.message));
           } else {
               alert("Passwords are not same");
           }
       } else {
           alert("Please Fill Out the Fields");
       }

       fb.auth().onAuthStateChanged(function(user) //checks there is an change in user activity
           {
               if (user) {
                   var userID = fb.auth().currentUser.uid; //get current user uid
                   fb.database().ref('Users/' + userID).once('value').then(function(snapshot) //get values from database
                       {
                           if (!snapshot.val()) {
                               res.sendFile(__dirname + "/accountDetails.html");
                           }
                       });
               }
           });
   });

   app.post("/accountSubmit", function(req, res) {

       var name = req.body.name;
       var phoneNo = req.body.phoneNo;
       var address = req.body.address;
       var userID = fb.auth().currentUser.uid;
       var email = fb.auth().currentUser.email;
       var rootRef = fb.database().ref("Users").child(userID);

       if (name != "" && phoneNo != "" && address != "") {

           var userdata = {
               "name": name,
               "phoneNo": phoneNo,
               "address": address,
               "email": email
           }
           rootRef.set(userdata, function(error) {
               if (error) {
                   alert("Message :" + error.message);
               } else {
                   fb.database().ref('Users/' + userID).once('value').then(function(snapshot) {
                       if (snapshot.val()) {
                           res.sendFile(__dirname + "/home.html");
                       }
                   });
               }
           });
       } else {
           alert("Please Fill Out the Fields");
       }
   });

   //Creating database with bookingDetails

   app.post("/bookingDetails", function(req, res) {

       var bookingDate = req.body.bookingDate;
       var vehicleName = req.body.vehicleName;
       var userID = fb.auth().currentUser.uid;
       var email = fb.auth().currentUser.email;
       var orderID = (Math.random() + 1).toString(36).substring(4) + Math.floor(Math.random() * 999773)
       var vehicleNo = req.body.vehicleNo;
       var bookingTime = req.body.bookingTime;
       var bookingStatus = "pending";
       var serviceType = req.body.service;
       var bookedBy = req.body.name;
       var dateObj = new Date();
       var month = dateObj.getUTCMonth() + 1;
       var day = dateObj.getUTCDate();
       var year = dateObj.getUTCFullYear();
       var newdate = day + " / " + month + " / " + year;

       if (bookingTime != null && bookingDate != null && vehicleNo != null && vehicleName != null &&
           bookedBy != null && serviceType != null && email != null) {

           //setdata to firebasse
           var usersRef = fb.database().ref("Users/" + userID + "/Orders").child(orderID);
           var userdata = {
               "vehicleName": vehicleName,
               "vehicleNo": vehicleNo,
               "orderID": orderID,
               "userUID": userID,
               "email": email,
               "bookingDate": bookingDate,
               "bookingTime": bookingTime,
               "bookingStatus": bookingStatus,
               "serviceType": serviceType,
               "bookedBy": bookedBy,
               "bookedDate": newdate
           }
           usersRef.set(userdata, function(error) {
               if (error) {
                   alert("Message :" + error.message);
               }
           })
           alert("Successfully Booked, Please drop your vehicle at booked time, THANK YOU !!!")
       } else {
           alert("Fill All The Details ... ")
       }
       res.redirect("/home")
           // NODEMAILER Sends mail to the owner

       //    var nodemailer = require('nodemailer');

       //    var transporter = nodemailer.createTransport({
       //        service: 'gmail',
       //        auth: {
       //            user: 'youremail@gmail.com',
       //            pass: 'yourpassword'
       //        }
       //    });

       //    var mailOptions = {
       //        from: 'youremail@gmail.com',
       //        to: 'myfriend@yahoo.com',
       //        subject: 'Sending Email using Node.js',
       //        text: 'That was easy!'
       //    };

       //    transporter.sendMail(mailOptions, function(error, info) {
       //        if (error) {
       //            console.log(error);
       //        } else {
       //            console.log('Email sent: ' + info.response);
       //        }
       //    });
   });

   app.get("/customerDetails", function(req, res) {
       var c = []
       var Pc = []
       var userID = fb.auth().currentUser.uid;
       fb.database().ref("Users/" + userID + "/Orders").once('value').then(function(snapshot) {
           var x = snapshot.val();
           var uid = (x) ? Object.keys(x) : null
           if (uid != null) {
               for (var i = 0; i < uid.length; i++) {
                   if (x[uid[i]].bookingStatus == 'pending') {
                       c.push(x[uid[i]])
                   } else {
                       Pc.push(x[uid[i]])
                   }
               }
           }
           res.render(__dirname + "/customerDetails.html", {
               xx: c,
               aa: (c) ? Object.keys(c) : null,
               Px: Pc,
               Pa: (Pc) ? Object.keys(Pc) : null
           });
       });
   });

   app.post("/cancelBooking", function(req, res) {

       var orderID = req.body.orderid;
       var userID = req.body.useruid;
       fb.database().ref("Users/" + userID + "/Orders/" + orderID).remove();
       alert("Your Booking Order has been Cancelled")
       res.redirect('/customerDetails')

   })

   app.get("/editOwner", function(req, res) {
       fb.database().ref("Users/").once('value').then(function(snapshot) {
           var x = snapshot.val();
           var uid = Object.keys(x)
           var c = []
           var Pc = []
           for (var i = 0; i < uid.length; i++) {
               n = (x[uid[i]].Orders) ? Object.keys(x[uid[i]].Orders) : null
               if (n != null) {
                   for (var j = 0; j < n.length; j++) {
                       if (x[uid[i]].Orders[n[j]].bookingStatus == 'pending') {
                           c.push(x[uid[i]].Orders[n[j]])
                       } else {
                           Pc.push(x[uid[i]].Orders[n[j]])
                       }
                   }
               }
           }
           res.render(__dirname + "/editDetails.html", {
               xx: c,
               aa: (c) ? Object.keys(c) : null,
               Px: Pc,
               Pa: (Pc) ? Object.keys(Pc) : null
           });
       });
   });

   app.get("/viewDetails", function(req, res) {
       fb.database().ref("Users/").once('value').then(function(snapshot) {
           var x = snapshot.val();
           var a = (x) ? Object.keys(x) : null
           var address = []
           var phoneNo = []
           var name = []
           var email = []
           var pendingCount = []
           var completedCount = []
           var n
           if (a != null) {
               for (var i = 0; i < a.length; i++) {
                   address.push(x[a[i]].address)
                   phoneNo.push(x[a[i]].phoneNo)
                   name.push(x[a[i]].name)
                   email.push(x[a[i]].email)
                   n = (x[a[i]].Orders) ? Object.keys(x[a[i]].Orders) : null
                   if (n != null) {
                       for (var j = 0; j < n.length; j++) {
                           if (j == 0) {
                               pendingCount[i] = 0
                               completedCount[i] = 0
                           }
                           if (x[a[i]].Orders[n[j]].bookingStatus == 'pending') {
                               pendingCount[i] = pendingCount[i] + 1
                           } else {
                               completedCount[i] = completedCount[i] + 1
                           }
                       }
                   } else {
                       pendingCount[i] = 0
                       completedCount[i] = 0
                   }
               }
           }
           res.render(__dirname + "/viewallDetails.html", {
               aa: a,
               ad: address,
               ph: phoneNo,
               name: name,
               email: email,
               pendingOrder: pendingCount,
               completedOrder: completedCount
           });
       });
   });

   app.post("/editFirebase", function(req, res) {

       var status = (req.body.status) ? req.body.status : null;
       var editFB = req.body.editValue;
       var userUID = req.body.uid;

       //   usage of Firebase to update status of vehicle
       if (status != null) {
           var FBupdateUser = fb.database().ref("Users/" + userUID + "/Orders/" + editFB).update({ bookingStatus: status });
           FBupdateUser.catch((error) => alert(error.message))
           alert("Your vehicle Status has been updated successfully !!! ")
       } else {
           alert("Can't Update ! Please, Click the checkBox")
       }
       res.redirect('/editOwner')

       // NODEMAILER Sends mail to the owner

       //    var nodemailer = require('nodemailer');

       //    var transporter = nodemailer.createTransport({
       //        service: 'gmail',
       //        auth: {
       //            user: 'youremail@gmail.com',
       //            pass: 'yourpassword'
       //        }
       //    });

       //    var mailOptions = {
       //        from: 'youremail@gmail.com',
       //        to: 'myfriend@yahoo.com',
       //        subject: 'Sending Email using Node.js',
       //        text: 'That was easy!'
       //    };

       //    transporter.sendMail(mailOptions, function(error, info) {
       //        if (error) {
       //            console.log(error);
       //        } else {
       //            console.log('Email sent: ' + info.response);
       //        }
       //    });
   });

   //usage of firebase database to delete the node 

   app.post("/deleteFirebase", function(req, res) {

       var editFB = req.body.editValue;
       var userUID = req.body.uid;

       var FBDelUser = fb.database().ref("Users/" + userUID + "/Orders/" + editFB).remove();
       FBDelUser.catch((error) => alert(error.message))
       alert("This database value of the particular user has been deleted")
       res.redirect('/editOwner')
   });

   //Listens at port 5000

   app.listen(5000, async() => { console.log("server is running") });