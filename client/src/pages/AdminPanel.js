import React,{useState, useEffect ,useContext } from 'react';
import Timer from '../components/Timer.js';
import {toast} from 'react-toastify';
import openSocket from 'socket.io-client';
import useOnlineRoom from '../hooks/OnlineRoom.hook.js';
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook';


export  const AdminPanel = () => {

   const isActive1 = useOnlineRoom(1).isActive;
//    const isActive2 = useOnlineRoom(2).isActive;
//    const isActive3 = useOnlineRoom(3).isActive;
//    const isActive4 = useOnlineRoom(4).isActive;
//    const isActive5 = useOnlineRoom(5).isActive;
   const time1 = useOnlineRoom(1).time;
//    const time2 = useOnlineRoom(2).time;
//    const time3 = useOnlineRoom(3).time;
//    const time4 = useOnlineRoom(4).time;
//    const time5 = useOnlineRoom(5).time;

    return(<div className="container mt-5">
        {/* to={`/detail/${link._id}`} */} 
        <Link className="col-xl-8 mt-3 adminLink" style={{"text-decoration": "none"}}>
            <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center shadow-lg rounded-3 align-items-center"><h5 className="col-4  m-0"> Operator1 </h5>  <span className="col-2  text-center text-success rounded-3">{isActive1}</span> <p className="col-6 m-0 text-center">  <span className="text-warning  m-0">   <Timer props={time1}/></span> 
            </p>        
            </div>
        </Link>


        
        <div className="col-xl-8 mt-3">
        <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center justify-content-center  shadow-lg rounded-3 align-items-center"><h5 className="col-3  m-0"> Operator1 </h5>  <span className="col-2  text-center text-success rounded-3">{}</span> <p className="col-6 m-0 text-center"> 01.11.2022 <span className="text-warning  m-0"> 26h 30m</span> </p>
        </div>
        </div>
        <div className="col-xl-8 mt-3">
        <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center justify-content-center  shadow-lg rounded-3 align-items-center"><h5 className="col-3  m-0"> Operator1 </h5>  <span className="col-2  text-center text-success rounded-3">{}</span> <p className="col-6 m-0 text-center"> 01.11.2022 <span className="text-warning  m-0"> 26h 30m</span> </p>
        </div>
        </div>
        <div className="col-xl-8 mt-3">
        <div className="row mt-3 p-3 d-flex flex-row list-group-item-primary align-self-center justify-content-center  shadow-lg rounded-3 align-items-center"><h5 className="col-3  m-0"> Operator1 </h5>  <span className="col-2  text-center text-success rounded-3"></span> <p className="col-6 m-0 text-center"> 01.11.2022 <span className="text-warning  m-0"> 26h 30m</span> </p>
        </div>
        </div>
        </div>
    )
}