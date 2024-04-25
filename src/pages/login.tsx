import {auth,provider} from '../config/firebase';
import {signInWithPopup}from "firebase/auth";
import {useNavigate} from "react-router-dom";

export const Login = ()=>{
    const navigate = useNavigate()
    const signInwithGoogle = async()=>{
       const result = await signInWithPopup(auth, provider);
       console.log(result);
       navigate("/");//after login, back to home page
    };
    return <div>
    <p>
        Sign In With Google
    </p>
    <button onClick={signInwithGoogle}>sign in with google</button>
</div>
}