import React from "react";
import { Link } from 'react-router-dom'
import styles from "../css/HomePage.module.css"

export const HomePage = () => {

    return(
        <div className="Home_Page">
            <div className="blur">  
            <div className="container">
                <div className={styles.title}>
                <h2>kosg.su</h2>
                <h4>сервис дистанционного сурдоперевода, который позволяет организациям обеспечивать доступную среду для инвалидов по слуху с минимальными затратами, а глухим получить доступ к коммуникациям наравне со всеми.</h4>
                <Link className="nav-link" to="/" >выйти</Link>
                </div>
            </div>
            </div>
        </div>
    )

}