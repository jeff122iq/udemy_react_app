import React from 'react';
import {Link} from "react-router-dom";
import Page from "./Page";

const NotFound = () => {
    return (
        <Page title="Not found">
            <div className="text-center">
                <h2>Whoops, we can not find page.</h2>
                <p className="lead text-muted">Visit a <Link to="/">homepage</Link> to get a fresh start.</p>
            </div>
        </Page>
    );
};

export default NotFound;