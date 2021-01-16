import React, { useState, useEffect } from 'react';
import Axios from "axios";
import {Link, useParams} from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";


const ProfileFollowing = (props) => {
    const {username} = useParams()
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchPosts() {
            try{
                const response = await Axios.get(`/profile/${username}/following`, {cancelToken: ourRequest.token});
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
            {posts.map((following, index) => {
                return(
                    <Link key={index} to={`/profile/${following.username}/following`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={following.avatar}/>
                        {following.username}
                    </Link>
                );
            })}
        </div>
    );
};

export default ProfileFollowing;