import React, {useEffect, useState, useContext} from 'react';
import {useImmerReducer} from "use-immer";
import Page from "./Page";
import NotFound from "./NotFound";
import { useParams, Link, withRouter } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

const EditPost = (props) => {
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)

    const originalState = {
        title: {
            value: "",
            hasErrors: false,
            message: ""
        },
        body: {
            value: "",
            hasErrors: false,
            message: ""
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0,
        notFound: false,
    }

    function ourReducer(draft, action) {
        switch (action.type){
            case "fetchComplete":
                draft.title.value = action.value.title;
                draft.body.value = action.value.body;
                draft.isFetching = false;
                return;
            case "titleChange":
                draft.title.hasErrors = false;
                draft.title.value = action.value;
                return;
            case "bodyChange":
                draft.body.hasErrors = false;
                draft.body.value = action.value;
                return;
            case "submitRequest":
                if (!draft.title.hasErrors && !draft.body.hasErrors) {
                    draft.sendCount++;
                }
                return;
            case "saveRequestStarted":
                draft.isSaving = true;
                return
            case "saveRequestFinished":
                draft.isSaving = false;
                return;
            case "titleRules":
                if (!action.value.trim()){
                    draft.title.hasErrors = true;
                    draft.title.message = "You must provide a title"
                }
                return;
            case "bodyRules":
                if (!action.value.trim()){
                    draft.body.hasErrors = true;
                    draft.body.message = "You must provide a body"
                }
                return;
            case "notFound":
                draft.notFound = true;
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, originalState)

    function submitHandler(event) {
        event.preventDefault();
        dispatch({type: "titleRules", value: state.title.value})
        dispatch({type: "bodyRules", value: state.body.value})
        dispatch({type: "submitRequest"});
    }
    
    useEffect(() => {
        async function fetchPost() {
            try{
                const response = await Axios.get(`/post/${state.id}`);
                if (response.data) {
                    dispatch({type: "fetchComplete", value: response.data});
                    if (appState.user.username != response.data.author.username) {
                        appDispatch({type: "flashMessage", value: "Ypu do not have permission to edit this post."});
                    //    Redirect to homePage
                        props.history.push("/");

                    }
                } else {
                    dispatch({type: "notFound"})
                }
            } catch (error) {
                console.log("There was a problem");
            }
        }
        fetchPost();
    }, [])

    useEffect(() => {
       if (state.sendCount) {
               async function fetchPost() {
                   dispatch({type: "saveRequestStarted"})
                   try{
                       const response = await Axios.post(`/post/${state.id}/edit`, {title: state.title.value, body: state.body.value, token: appState.user.token});
                       dispatch({type: "saveRequestFinished"});
                       appDispatch({type: "flashMessage", value: "Post is edited!"})
                   } catch (error) {
                       console.log("There was a problem: " + error);
                   }
               }
               fetchPost();
       }
    }, [state.sendCount])

    if (state.notFound) {
        return (
          <NotFound/>
        )
    }

    if (state.isFetching) {
        return (
            <Page title={"..."}>
                <LoadingDotsIcon/>
            </Page>
        );
    }

    return (
        <Page title="Edit post">
            <Link className="small font-weight-bold" to={`/post/${state.id}`}>&laquo; Back to post permalink!</Link>
            <form className="mt-3" onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input onBlur={event => dispatch({type: "titleRules", value: event.target.value})} onChange={event => dispatch({type: "titleChange", value: event.target.value})} value={state.title.value} autoFocus name="title" id="post-title"
                           className="form-control form-control-lg form-control-title" type="text" placeholder=""
                           autoComplete="off"/>
                    {/**/}
                    {state.title.hasErrors &&
                    <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>
                    }
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea onBlur={event => dispatch({type: "bodyRules", value: event.target.value})} onChange={event => dispatch({type: "bodyChange", value: event.target.value})} value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" >
                    </textarea>
                    {state.body.hasErrors &&
                    <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
                </div>
                <button className="btn btn-primary" disabled={state.isSaving}>Save updates</button>
            </form>
        </Page>
    );
};

export default withRouter(EditPost);