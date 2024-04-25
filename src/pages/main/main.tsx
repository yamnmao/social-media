import { getDatabase } from "firebase/database";
import { db } from "../../config/firebase";
import { getDocs,collection } from "firebase/firestore"
import { useState,useEffect } from "react";
import { Post } from "./post";

//define a interface represent what a post looks like
export interface PostInterface {
    postid:string,
    userid: string,
    username: string,
    title: string,
    description:string,

}

export const Main = ()=>{
    //userState<Post[] | null>(null); the state is an array post or null
    const [postsList, setPostsList] = useState<PostInterface[] | null >(null);
    const postsRef = collection(db,"posts");//get posts collection for firebase store

    const getPosts = async() =>{
        const data = await getDocs(postsRef);//get Posts db
        setPostsList(data.docs.map((doc)=>({
            ...doc.data(),postid:doc.id
            })) as PostInterface[]//cast data as Post type
            //这个interface里面的名字要和doc里面的field name一样才能cast，比如一开始userid在
            //interface里面是userId，然后后面的propsPost.userId就render不出来
        );
        console.log(data.docs.map((doc)=>({
            ...doc.data(),postid:doc.id
            })) as PostInterface[]
        );
    };
    useEffect(()=>{
        getPosts();
    },[])//put a empty array over here, implement getPosts() and then mount.
   // getPosts();

   //postsLists is all data of posts collection, use map function to traverse the single post doc
   //single post as a component, loop post data with Post/ component and passed data "post" by props function
   //props called postProps 
   return (
    <div>
        {postsList?.map((postData)=>(
        <Post postProps={postData}/>
        ))}
    </div>)
}