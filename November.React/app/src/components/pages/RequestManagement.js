import React, { useEffect, useState } from 'react'
import Request from '../../services/request'

function RequestManagement() {
    let [state, setState] = useState();

    useEffect(() => {
        console.log(state)

        Request.getRequests().then(res => {
            console.log(res);
            setState({ requests: res.data });
        })
    }, []);
    if (state) {
        let games = state.requests.map(request => (
            <div> {request.user_id}</div>
        ))


        return (
            <div>
                {games}
            </div>
        )
    }
    else { return (<div>Loading...</div>) }

}

export default RequestManagement
