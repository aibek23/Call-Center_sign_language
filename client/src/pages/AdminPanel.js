import React from 'react';
import Timer from '../components/Timer.js';
import openSocket from 'socket.io-client';
import useOnlineRoom from '../hooks/OnlineRoom.hook.js';
import {Link} from 'react-router-dom'
// const socket = openSocket.connect('http://localhost:5000', { reconnection: false })
const socket = openSocket.connect('https://kosg.su', { reconnection: false })
export  const AdminPanel = () => {

   const isActive1 = useOnlineRoom(1).isActive;
   const isActive2 = useOnlineRoom(2).isActive;
   const isActive3 = useOnlineRoom(3).isActive;
   const isActive4 = useOnlineRoom(4).isActive;
   const isActive5 = useOnlineRoom(5).isActive;
   const time1 = useOnlineRoom(1).time;
   const time2 = useOnlineRoom(2).time;
   const time3 = useOnlineRoom(3).time;
   const time4 = useOnlineRoom(4).time;
   const time5 = useOnlineRoom(5).time;
    return(<div className="container mt-5">
        <Link to={`/detailVideo/${1}`} className="col-xl-8 mt-3 adminLink" style={{"text-decoration": "none"}}>
            <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center shadow-lg rounded-3 align-items-center"><h5 className="col-4  m-0"> Operator1 </h5>  <span className="col-2  text-center text-success rounded-3">{isActive1}</span> <p className="col-6 m-0 text-center">  <span className="text-warning  m-0">   <Timer props={time1}/></span> 
            </p>        
            </div>
        </Link>
        <Link to={`/detailVideo/${2}`} className="col-xl-8 mt-3 adminLink" style={{"text-decoration": "none"}}>
            <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center shadow-lg rounded-3 align-items-center"><h5 className="col-4  m-0"> Operator2 </h5>  <span className="col-2  text-center text-success rounded-3">{isActive2}</span> <p className="col-6 m-0 text-center">  <span className="text-warning  m-0">   <Timer props={time2}/></span> 
            </p>        
            </div>
        </Link>

        <Link to={`/detailVideo/${3}`} className="col-xl-8 mt-3 adminLink" style={{"text-decoration": "none"}}>
            <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center shadow-lg rounded-3 align-items-center"><h5 className="col-4  m-0"> Operator3 </h5>  <span className="col-2  text-center text-success rounded-3">{isActive3}</span> <p className="col-6 m-0 text-center">  <span className="text-warning  m-0">   <Timer props={time3}/></span> 
            </p>        
            </div>
        </Link>
        <Link to={`/detailVideo/${4}`} className="col-xl-8 mt-3 adminLink" style={{"text-decoration": "none"}}>
            <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center shadow-lg rounded-3 align-items-center"><h5 className="col-4  m-0"> Operator4 </h5>  <span className="col-2  text-center text-success rounded-3">{isActive4}</span> <p className="col-6 m-0 text-center">  <span className="text-warning  m-0">   <Timer props={time4}/></span> 
            </p>        
            </div>
        </Link>
        <Link to={`/detailVideo/${5}`} className="col-xl-8 mt-3 adminLink" style={{"text-decoration": "none"}}>
            <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center shadow-lg rounded-3 align-items-center"><h5 className="col-4  m-0"> Operator5 </h5>  <span className="col-2  text-center text-success rounded-3">{isActive5}</span> <p className="col-6 m-0 text-center">  <span className="text-warning  m-0">   <Timer props={time5}/></span> 
            </p>        
            </div>
        </Link>
        </div>
    )
}