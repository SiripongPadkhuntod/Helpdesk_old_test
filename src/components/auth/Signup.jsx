import React,{useState} from 'react'
import {auth} from '../../Firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
    
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [password2, setPassword2] = useState('')
    
        const handleSubmit = (e) => {
            e.preventDefault()
            if (password !== password2) {
                console.log('Passwords do not match')
            }
            else {
                SignUP()
            }
        }

        const SignUP = async () => {
            try {
                const user = await createUserWithEmailAndPassword(auth, email, password);
                console.log('Signed in successfully!')
                console.log(user)
                return "Signed in successfully!"
            }
            catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                return errorMessage
            }
        }



  return (
    <div>
        <h1>Sign Up</h1>
        <form>
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder='con - Password' value={password2} onChange={(e) => setPassword2(e.target.value)} />
            <button onClick={handleSubmit}>Sign Up</button>

            <p>Already have an account?</p>
            <a href='/SignIn'>Sign In</a>
        </form>
    </div>
  )
}

export default Signup