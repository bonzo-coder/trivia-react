import React from "react"

export default function Question (props) {
// color settings to answer options
    function styles(buttonState) {
        if (props.gameWon) {
            if (buttonState.guessed === "yes") {
                return {backgroundColor: "#90FF93" }
            } else {
                return {backgroundColor: buttonState.guessed === "no" ? "#FFA9BB" : buttonState.guessed === "correctAns"? "#DDB5FF" : "transparent"}
            }
         } else {
            return {backgroundColor: buttonState.held ? "rgb(235, 195, 52)" : "transparent"}
        }
    }

    return (
        <div>
            <div className="questionsPlace">
                <div className="questionBox">{props.question}</div>
                <div className="answers" >
                    <div className="ansBox" id={props.answers[0].id} name={props.name} style={styles(props.answers[0])}  onClick={props.toggle} >{props.answers[0].ans}</div>
                    <div className="ansBox" id={props.answers[1].id} name={props.name} style={styles(props.answers[1])}  onClick={props.toggle}>{props.answers[1].ans}</div>
                    <div className="ansBox" id={props.answers[2].id} name={props.name} style={styles(props.answers[2])}  onClick={props.toggle}>{props.answers[2].ans}</div>
                    <div className="ansBox" id={props.answers[3].id} name={props.name} style={styles(props.answers[3])}  onClick={props.toggle}>{props.answers[3].ans}</div>
                </div>
                <hr></hr>
            </div>
        </div>
    )
}