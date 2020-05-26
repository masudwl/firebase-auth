import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig); 

function App() {
  const [user, setUser] = useState({
    isSignedIn: false, 
    name: '', 
    email: '', 
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = ()=>{
    firebase.auth().signInWithPopup(provider)
    .then ( res => {
      const {displayName, photoUrl, email} = res.user; 
      const signedInUser = {
        isSignedIn: true, 
        name: displayName, 
        email: email, 
        photo: photoUrl
      }
      setUser (signedInUser); 
    })
    .catch (err =>{

    })
  }
  const signedOutBtn = ()=> {
    firebase.auth().signOut()
    .then (res => {
      const signedOutUser = {
        isSignedIn: false, 
        name: '', 
        email: '', 
        photo: '', 
        password: '',
        error: '',  
        isValid: false
      }
      setUser(signedOutUser); 
    })
    .catch (err => {

    })
  }
   //validation 
  const is_valid_email = email => /\S+@\S+\.\S+/.test(email); 
  const isNumber = input => /\d/.test(input); 

  const switchForm = e => {
    const createUser = {...user}; 
    createUser.existingUser = e.target.checked; 
    setUser(createUser); 
  }

  const inputChange = e =>{
    const userInfo ={
      ...user
    }; 
    //for validation
    let isValid = true; 
    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name ==='password'){
      isValid = e.target.value.length > 8 && isNumber(e.target.value); 
    }
    userInfo[e.target.name] = e.target.value; 
    userInfo.isValid = isValid; 
    setUser(userInfo); 
  }
  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const createUser = {...user}; 
        createUser.isSignedIn = true;
        createUser.error = '';  
        setUser(createUser);
      })
      .catch (err =>{
        console.log(err);
          const createUser = {...user}; 
          createUser.isSignedIn = false;
          createUser.error = err.message;  
          setUser(createUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }
  
  const signInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const createUser = {...user}; 
        createUser.isSignedIn = true;
        createUser.error = '';  
        setUser(createUser);
      })
      .catch (err =>{
        console.log(err);
          const createUser = {...user}; 
          createUser.isSignedIn = false;
          createUser.error = err.message;  
          setUser(createUser);
      })
    }
    event.preventDefault(); 
    event.target.reset(); 
  }
 
  
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={signedOutBtn}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button> 
      }
      {
        user.isSignedIn && <div>
          <p>Welcome to {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our Authentication</h1>

      <input type="checkbox" onChange={switchForm} name="switchFrom" id="switchForm"/>
      <label htmlFor="switchForm">Returning User</label>
      <form style={{display: user.existingUser ?  'block' : 'none'}} onSubmit={signInUser}>
        <input type="text" name="email" onBlur={inputChange} placeholder="Email Here" id=""/>
        <br></br>
        <input type="password" name="password" onBlur={inputChange} placeholder="Passward Here" id=""/>
        <br></br>
        <input type="submit" value="Sign In"/>
      </form>
      <form style={{display: user.existingUser ?  'none' : 'block'}} onSubmit={createAccount}>
        <input type="text" onBlur={inputChange} name="name" placeholder="Enter your Name" required/>
        <br></br>
        <input type="text" onBlur={inputChange} name="email" placeholder="Enter your Email" required/>
        <br></br>
        <input type="password" onBlur={inputChange} name="password" placeholder="Enter Your Password Here" required/>
        <br></br>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
