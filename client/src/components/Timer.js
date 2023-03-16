// import "./Timer.css";
export default function Timer(props) {

	if (!props.props) {
		return `0h:0m:0s`
	}

	var seconds = parseInt(props.props, 10); // don't forget the second param
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = seconds - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
	return `${hours}h:${minutes}m:${seconds}s`
}
