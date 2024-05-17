import React,{ useState,useEffect} from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../Firebase'



function Signin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const login = JSON.parse(window.localStorage.getItem('login'));
        if (login && login.Token) {
          window.location.href = '/'; // ส่งไปหน้า Home หากมี Token
        }
      },);

    const handleSubmit = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log('Signed in successfully!')
            // console.log(user)
            window.localStorage.setItem('login', JSON.stringify({ Token: user }));     
            window.location.href = '/'; // ส่งไปหน้า Home หากมี Token
            // ...
          })
          .catch((error) => {
            if (error.code === 'auth/invalid-credential') {
                console.log('Invalid credential')
            }

          });
    }





  return (
    <div className='sign-in-container'>
        <h1>Sign In</h1>
        <form>
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSubmit}>Sign In</button>

            <p>Don't have an account?</p>
            <a href='/SignUp'>Sign Up</a>
        </form>
    </div>
  )
}

export default Signin