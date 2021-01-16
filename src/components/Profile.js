import React, { useEffect, useContext } from "react";
import { useImmer } from "use-immer";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";
import ProfileFollowers from "./ProfileFollowers";
import ProfileFollowing from "./ProfileFollowing";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";

const Profile = () => {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [ state, setState ] = useImmer({
    followActionLoading: false,
    startFollowingReqCount: 0,
    stopFollowingReqCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar:
        "https://gravatar.com/avatar/b6b925703d2ff83e929b57bc17b2356c?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${username}`, {
          token: appState.user.token,
        });
        setState((draft) => {
          draft.profileData = response.data;
        });
      } catch (error) {
        console.log(`There was a problem: ${error}`);
      }
    }
    fetchData();
  }, [username]);

  //---------------------Start_Following------------------------
  useEffect(() => {
    if (state.startFollowingReqCount ) {
      setState(draft => {
        draft.followActionLoading = true;
      })
      async function fetchData() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, {
            token: appState.user.token,
          });
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(`There was a problem: ${error}`);
        }
      }
      fetchData();
    }
  }, [state.startFollowingReqCount]);

//---------------------Stop_Following------------------------
  useEffect(() => {
    if (state.stopFollowingReqCount ) {
      setState(draft => {
        draft.followActionLoading = true;
      })
      async function fetchData() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, {
            token: appState.user.token,
          });
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log(`There was a problem: ${error}`);
        }
      }
      fetchData();
    }
  }, [state.stopFollowingReqCount]);

  function startFollowing() {
    setState(draft => {
      draft.startFollowingReqCount++;
    })
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingReqCount++;
    })
  }
  
  return (
    <Page>
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username !== state.profileData.profileUsername &&
          state.profileData.profileUsername !== "..." && (
            <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.loggedIn &&
        state.profileData.isFollowing &&
        appState.user.username !== state.profileData.profileUsername &&
        state.profileData.profileUsername !== "..." && (
            <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">
              Stop Following <i className="fas fa-user-times"></i>
            </button>
        )}
      </h2>
      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className=" nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className=" nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className=" nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route path="/profile/:username" exact>
          <ProfilePosts/>
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowers/>
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing/>
        </Route>
      </Switch>
    </Page>
  );
};

export default Profile;
