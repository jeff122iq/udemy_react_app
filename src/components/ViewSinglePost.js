import React, {useEffect, useState, useContext} from 'react';
import Page from "./Page";
import {Link, useParams, withRouter} from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";


const ViewSinglePost = (props) => {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState();
    const {id} = useParams();

    useEffect(() => {
        async function fetchPost() {
            try{
                const response = await Axios.get(`/post/${id}`);
                setPost(response.data);
                setIsLoading(false);
            } catch (error) {
                console.log("There was a problem");
            }
        }
        fetchPost();
    }, [])

    if (!isLoading && !post) {
        return (
            <NotFound/>
        )
    }

    if (isLoading) {
        return (
            <Page title={"..."}>
               <LoadingDotsIcon/>
            </Page>
        );
    }

    const  date = new Date(post.createdDate);
    const dateFormated = `${date.getMonth() + 1}/${date.getDate()}/${date.getDay()}/${date.getFullYear()}`

    function isOwner() {
        if(appState.loggedIn) {
            return appState.user.username == post.author.username;
        }
        return false;
    }

    async function deleteHandler() {
        const areYouSure = window.confirm("Do ypu want to delete this post?");
        if (areYouSure) {
            try {
                const response = await Axios.delete(`/post/${id}`, {
                    data: {
                        token: appState.user.token
                    }
                })
                if (response.data == "Success") {
                    // 1. display Flash Message
                    appDispatch({type: "flashMessage", value: "Post was successfully delete!"})
                    // 2. redirect
                    props.history.push(`/profile/${appState.user.username}`)

                }
            } catch (error) {
                console.log("There was a problem in " + error);
            }
        }
    }

    return (
<Page title={post.title}>
    <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
            <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2"><i className="fas fa-edit"></i></Link>{" "}
                <ReactTooltip id="edit" className="custom-tooltip"/>
          <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger"><i className="fas fa-trash"></i></a>
             <ReactTooltip id="delete" className="custom-tooltip"/>
        </span>
        )}

    </div>

    <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
            <img className="avatar-tiny" src={post.author.avatar}/>
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormated}
    </p>

    <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]}/>
    </div>
</Page>
    );
};

export default withRouter(ViewSinglePost);