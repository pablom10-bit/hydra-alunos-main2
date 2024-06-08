import React from 'react';

function NewOrderButton() {
    return (
        <React.Fragment>
            {
                localStorage.getItem("hasFutures") === "true"
                    ? (
                        <React.Fragment>
                            <button id="btnNewOrder" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                                <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                                    <path fillRule="evenodd"
                                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                        clipRule="evenodd"></path>
                                </svg>
                                New Order
                            </button>
                            <ul className='dropdown-menu'>
                                <li><a id="linkSpot" className='dropdown-item' href="#" data-bs-toggle="modal" data-bs-target="#modalOrder">Spot</a></li>
                                <li><a id="linkFutures" className='dropdown-item' href="/futures">Futures</a></li>
                            </ul>
                        </React.Fragment>
                    )
                    : (
                        <button id="btnNewOrder" className="btn btn-primary animate-up-2" data-bs-toggle="modal" data-bs-target="#modalOrder">
                            <svg className="icon icon-xs me-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                                <path fillRule="evenodd"
                                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                                    clipRule="evenodd"></path>
                            </svg>
                            New Order
                        </button>
                    )
            }
        </React.Fragment >
    );
}

export default NewOrderButton;