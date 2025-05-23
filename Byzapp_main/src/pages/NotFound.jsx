//NOT FOUND COMPONENT
import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/NotFound.css";

const NotFound = () => {
    return (
        <div className="not-found-container">
        <div className="not-found">
            <h10 className = "h10">404</h10>
            <h20 className = "h20">Page not found</h20>
            <Link to="/">
            <button className ="b404">Go to home</button>
            </Link>
        </div>
        </div>
    );
    }

export default NotFound;