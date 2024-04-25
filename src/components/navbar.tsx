import{Link} from 'react-router-dom'
import {auth} from "../config/firebase"
import {signOut} from "firebase/auth"
import {useAuthState} from 'react-firebase-hooks/auth'

export const Navbar = ()=>{
    const [user,loading, error] = useAuthState(auth);

    const signUserOut = async()=>{
        await signOut(auth);
    }
    
    return (
    <div className = "navbar">
        <div className = "Links">
            <Link to="/">Home</Link>
            {!user ? (<Link to="/login">Login</Link>):
                    (<Link to="/createpost">Create Post</Link>)}
        </div>
        <div className="user">
            { user && (
                <>
                <p>
                    {auth.currentUser?.displayName}
                    {user?.displayName}
                </p>
                    <img src={auth.currentUser?.photoURL || ""}/>
                    {/**auth.currentUser?.photoURL: The ?. is the optional chaining operator in JavaScript (and by extension, TypeScript),
                    * only access photoURL if currentUser is not null or undefined. If currentUser is null or undefined, it will return undefined.
                    * || "": The logical OR operator || is used here to provide a fallback value. 
                    * If auth.currentUser?.photoURL is undefined ( no user logged in or user has no photoURL), then the empty string "" is used as the src value. 
                    * This prevents the browser from making a request to a non-existent URL, which could result in a 404 error.
                    */
                    }
                    <button onClick={signUserOut}>Log Out</button>
                    </>
                )
            }
            
        </div>
    </div>
    )
}