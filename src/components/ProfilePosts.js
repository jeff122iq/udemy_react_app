import React, { useState, useEffect } from 'react';
import Axios from "axios";
import {Link, useParams} from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";


const ProfilePosts = (props) => {
    const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try{
                const response = await Axios.get(`/profile/${username}/posts`, {cancelToken: ourRequest.token});
                setPosts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log("There was a problem");
            }
        }
        fetchPosts();
        return () => {
            ourRequest.cancel();
        }
    }, [username])

    if (isLoading) {
        return(
            <LoadingDotsIcon/>
        );
    }

    return (
        <div className="list-group">
            {posts.map(post => {
                const  date = new Date(post.createdDate);
                const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getDay()}/${date.getFullYear()}`

                return(
                    <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={post.author.avatar}/>
                        <strong>{post.title}</strong>{" "}
                        <span className="text-muted small">on {dateFormated} </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default ProfilePosts;