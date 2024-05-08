import {Post as PostInterface} from './main' 
// you can use “as” to define a other name to avoid same name 
import { db,auth } from "../../config/firebase";
import { doc,query,where,getDocs,addDoc,collection,deleteDoc } from "firebase/firestore"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useEffect, useState} from 'react'

interface postProps{
    postProps: PostInterface, 
}
interface Like {
    likeid: string;
    userid: string;
  }

//get a single post doc from props from main
//如果是要用destructuring的方法获取props，这里应该是const Post = ({ postProps }) 
//在typescript里面则是export const Post = ({ postProps }: { postProps: PostProps }) 
export const Post =(props:postProps)=>{
     //解构赋值，原本的写法是props.postProps
    const {postProps} =props;
    const [user] = useAuthState(auth);
    const likesRef = collection(db,"likes");

    //setState
    const [likes, setLikes] = useState<Like[] | null>(null);

    //Array.prototype.find(), each element in this like array is gonna be a like，looping through the array
    //find the condition satisfied the userid of the like equal to the current user id from auth
    const hasUserLiked = likes?.find((like)=> like.userid === user?.uid )
    
    //CRUD
    //Create, add id of post and user to likes collecton.
     const addLike= async ()=>{
        try{
            const newDoc = await addDoc(likesRef,{ 
                //这个地方以前写的是Id直接挂了，因为PostInterface/postProps的 interface里面只有postid
                //而且注意是postProps.postid，而不是改这个likesRef这个doc里面的postid。
                postid: postProps.postid, //给like这个collection里面的加上doc，每个doc的postid和userid进行赋值
                userid:user?.uid
            });
            if(user){
                setLikes((prev)=>
                    prev
                        ?[...prev,{userid:user.uid, likeid: newDoc.id}]
                        :[{userid:user.uid, likeid: newDoc.id}]
                );
            }
        }catch(error){
            console.log(error);
        }
    };

    //Read
    const getLikes =async ()=>{
       try{
            //This query is used to fetch all like documents associated with a specific post.
            const getLikesQuery = query(likesRef,where("postid", "==",postProps.postid))

            const getLikesData = await getDocs(getLikesQuery);
            setLikes(
                getLikesData.docs.map((doc)=>({
                    userid: doc.data().userid,//给like里面的userid likeid 赋值
                    likeid: doc.id
                })));
        }catch(error){
            console.log(error);
        }
    }

    //Delete
    const deleteLike = async()=>{
        try{
            const removeLikeQuery = query(
                likesRef,
                where("postid", "==",postProps.postid),
                where("userid","==",user?.uid)
            )
            const removeLikeData = await getDocs(removeLikeQuery);
            const removelikeId = removeLikeData.docs[0].id;
            const removeLike = doc(db, "likes", removelikeId);
            await deleteDoc(removeLike);

            if (user) {
                setLikes(
                  (prev) => prev && prev.filter((like) => like.likeid !== removelikeId)
                );//when prev is  not null
              }
            }catch(error){
            console.log(error)
        }
    }
 
    useEffect(()=>{
        getLikes();
    },[]);

   //当hasUserLike为真，点击emoji的时候则是去掉点赞，反之就是正常点赞
    //当hasUserLike为真，点赞背景变成灰色，否则为透明
    return(
        <div className='main-content'>
            <div className="title">
                {postProps.title}
            </div>
            <div className="user">
                <p>{postProps.username}-{postProps.userid}</p>
            </div>
            <div className = "body">
                <p>{postProps.description}</p>
            </div>
            <div className="footer">
                <>
                    <button 
                    onClick={hasUserLiked ? deleteLike : addLike}
                    className={`py-2 px-2 rounded ${hasUserLiked ? 'bg-gray-300' : 'bg-transparent'}`}>
                            &#128077;{likes?.length}
                    </button>
                    </>
            </div>
        </div>
    );
}