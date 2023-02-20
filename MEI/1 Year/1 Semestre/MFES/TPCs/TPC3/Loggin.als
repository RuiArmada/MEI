sig Password {}
sig User {
	var password : set Password
}
var sig LoggedIn in User {}

// Guess what is the behavior of this authentication concept!
//
// To check how many points you have so far you can use the different commands. 
// The maximum is 5 points.


pred addUser [pass:Password , user:User]{

    historically user not in LoggedIn

    LoggedIn' = LoggedIn + user 

    password' = password + user -> pass 

}

pred remUser [user:User] {

    user in LoggedIn

    LoggedIn' = LoggedIn - user 

    password' = password - user -> user.password

}
 
pred login [pass:Password, user:User] {

    user not in LoggedIn

    LoggedIn' = LoggedIn + user

    pass in user.password

    password' = password

}

pred logout [user:User] {

    user in LoggedIn

    LoggedIn' = LoggedIn - user

    password' = password

}

pred changePass [user:User, pass:Password] {

    user in LoggedIn

    historically user->pass not in password

    LoggedIn' = LoggedIn

    password' = password - user->user.password + user->pass

}

pred stutter {
    LoggedIn' = LoggedIn
    password' = password
}


pred behavior {

	no LoggedIn
  	no password
    
    always (
        (some u:User | some p:Password | changePass[u,p] or login[p,u] or addUser[p,u]) or 
        (some u:User | logout[u] or remUser[u]) or 
        stutter
    )

}