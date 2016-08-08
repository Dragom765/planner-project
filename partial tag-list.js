* (lgin) Login capabilities
  > (-user) username (email)
    * (-01) verify there is something to verify
    * (-02) database verification
    * (-01) registered vs not => directs to sign-in or create account

  > (-pswd) password 
    * (-01) verify there is something to verify
    * (-02) verify password
      ~ (-01) encrypt password
      ~ (-02) verify encryption in db matches

  > (-npwd) create new password
    * (-01) verify both entries match, and aren’t blank
    * (-02) save user
      ~ (-01) encrypt password
      ~ (-02) save user information into db
      ~ (-03) create tables for user’s tasks

* (plan) Week-planner application

  > (-head) Header
    * (-01) Customized title
    * (-02) Options dropdown menu
      ~ (-01) change password capabilities
      ~ (-02) delete user capabilities
      ~ (-03) list help capabilities
    * (-03) Week/Weekend/Weekday/Today selection for showing (optional)

  > (-wksl) Week Schedule List
    * (-01) show user tasks
      ~ (-01) get tasks
      ~ (-02) display tasks
      ~ (-03) enable scroll if appropriate
    * (-02) click shows details in toolbar

  > (-tlbr) Side toolbar
    * (-01) Title and Description fields
    * (-02) Select Weekday dropdown menu
      ~ (-01) click selects weekday value
    * (-03) Add & Delete (Update?) capabilities
      ~ (-01) update task lists after button is pressed

* (nswb) Node Server for Webpage

  > (-list) multiple listeners (eventually)
  > allow refresh to keep user in same ‘place’, not reset page to login

* (rest) Node Server for RESTful API

  > (-conn) connection to correct database
  > (-chek) ‘create database if doesn’t exist’ check
  > (-tabl) create tables needed if it doesn’t exist