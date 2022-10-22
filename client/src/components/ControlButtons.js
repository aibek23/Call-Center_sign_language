import React from "react";
// import "./ControlButtons.css";

export default function ControlButtons(props) {
const StartButton = (
	<div className="btn btn-one btn-start"
		onClick={()=>{
            
        props.handleStart()
            
        }}>
	Start
	</div>
);
const ActiveButtons = (
	<div className="btn-grp">
	<div className="btn btn-one"
		onClick={()=>{props.handlePauseResume()
            console.log("onclickOF")
        }}>
            stop
		{/* {props.isPaused ? "Resume" : "Pause"} */}
	</div>
	</div>
);

return (
	<div className="Control-Buttons">
	<div>{ActiveButtons}
     {StartButton}</div>
	</div>
);
}
