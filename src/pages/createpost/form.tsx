import {useForm} from 'react-hook-form';
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from 'yup';
import {addDoc, collection} from 'firebase/firestore'
import {auth, db} from "../../config/firebase"
import {useAuthState} from 'react-firebase-hooks/auth'
import {useNavigate} from 'react-router-dom'

interface formData{
    title:string;
    description:string;
}

export const CreateForm=()=>{
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    
    const schema = yup.object().shape({
        title: yup.string().required("must add a title"),
        description:yup.string().required("min 5 words").min(20),
    });

    const{register,handleSubmit,formState:{errors},}=useForm<formData>(
        {resolver:yupResolver(schema),}//get the schema we created before
    );

    const postsRef = collection(db,"posts");
    const onCreatePost= async (data:formData)=>{
        console.log( {
        ...data, 
        username: user?.displayName,
        userid:user?.uid})
        
        await addDoc(postsRef,{
            //title:data.title,
            //description:data.description,
            ...data, //spread operator
            username: user?.displayName,
            userid:user?.uid,
        });
        navigate("/");
    };

    return(
    <form onSubmit={handleSubmit(onCreatePost)}>
        <input placeholder="Title"{...register("title")}/>
        <p>{errors.title?.message}</p>
        <textarea placeholder="Description"{...register("description")}/>
        <p>{errors.description?.message}</p>
        <input type="submit"/>
    </form>
)
}