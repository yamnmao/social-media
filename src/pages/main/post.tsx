import {PostInterface} from './main' 
// you can use “as” to define a other name to avoid same name 
import { db,auth } from "../../config/firebase";
import { query,where,getDocs,addDoc,collection } from "firebase/firestore"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useEffect, useState} from 'react'

//Here we give props some interface definition
interface postProps{
    postProps: PostInterface, //export Post interface make it public and can be used by other component
}
interface Like {
    likeid: string;
    userid: string;
  }
//get a single post doc from props from main
export const Post =(props:postProps)=>{
    const [user] = useAuthState(auth);
     //解构赋值，原本的写法是props.postProps
    const {postProps} =props;

    const [likes, setLikes] = useState<Like[] | null>(null);

    const likesRef = collection(db,"likes");

    const likesDoc = query(likesRef,where("postid", "==",postProps.postid))

    //Write, add id of post and user to likes collecton.
     const addLike= async ()=>{
        await addDoc(likesRef,{
            //这个地方以前写的是id直接挂了，因为PostInterface/postProps的 interface里面只有postId
            //而且注意是postProps.postId，而不是改这个likesRef这个doc里面的postid。
            postid: postProps.postid,
            userid:user?.uid
        });
    };

    //Read
    const getLikes =async ()=>{
       const data = await getDocs(likesDoc);
       setLikes(
        data.docs.map((doc)=>({
        userid: doc.data().userid,
        likeid: doc.id
        })));
    }

 
    useEffect(()=>{
        getLikes();
    },[]);
   
    return(
        <div>
            <div className="title">
                {postProps.title}
            </div>
            <div className="header">
                <p>{postProps.username}-{postProps.userid}</p>
            </div>
            <div className = "body">
                <p>{postProps.description}</p>
            </div>
            <div className="footer">
                <button onClick={addLike}>&#128077;</button>
            </div>
        </div>
    );
}