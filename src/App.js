import React from 'react';
import './App.css';
import Question from "./Question"
import { nanoid } from 'nanoid';


function App() {

const [start, setStart]= React.useState(true)
const [questions, setQuestions] = React.useState([])
const [answers, setAnswers] = React.useState([])
const [userAns, setUserAns] = React.useState(["1","2","3","4","5"])
const [ansShownScreen, setAnsShownScreen] = React.useState([])
const [gameWon, setGameWon] = React.useState(false)
const [ansCorrect, setAnsCorrect] = React.useState(0)
// changes start screen into game
function changeStart () {
  setStart(!start)
}

// data download from api
React.useEffect(() => {
  fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
  .then(res => res.json())
  .then(data => {

    function decodeHtml(html) {
      console.log(html)
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
  }
    const questionsArray = []
    const answersArray =[]
    for (let i=0; i<5; i++) {
      questionsArray.push({
        question: decodeHtml(data.results[i].question),
        id: i,
      })
      answersArray.push({
         correct: decodeHtml(data.results[i].correct_answer),
         incorrect: [decodeHtml(data.results[i].incorrect_answers[0]),
                     decodeHtml(data.results[i].incorrect_answers[1]),
                     decodeHtml(data.results[i].incorrect_answers[2]),]
      })
    }
    setUserAns(prev=> ["1","2","3","4","5"])
    setGameWon(prev=> false)
    setAnsCorrect(prev => 0)
    saveAnsShown(answersArray, questionsArray)
  })
},[start])

function saveAnsShown (ans, que) {
  setQuestions(que)
  setAnswers(ans)
  setAnsShownScreen(() => [
     mixAnswers(ans[0]),
     mixAnswers(ans[1]),
     mixAnswers(ans[2]),
     mixAnswers(ans[3]),
     mixAnswers(ans[4])
     
  ])
  
}

function mixAnswers (obj) {
    let finalAnsArr = []
    let newAnswers = [
      obj.correct, 
      obj.incorrect[0],
      obj.incorrect[1],
      obj.incorrect[2],
    ]
    //choose 1 ans randomly
    const choose1 = Math.floor(Math.random()*3)
    finalAnsArr.push({id:nanoid(), ans:newAnswers[choose1], held:false, guessed: ""})
    newAnswers.splice(choose1,1)
    //choose 2 ans randomly
    const choose2 = Math.floor(Math.random()*2)
    finalAnsArr.push({id:nanoid(), ans:newAnswers[choose2], held:false, guessed: ""})
    newAnswers.splice(choose2,1)
    //choose 3 ans randomly
    const choose3 = Math.floor(Math.random())
    finalAnsArr.push({id:nanoid(), ans:newAnswers[choose3], held:false, guessed: ""})
    newAnswers.splice(choose3,1)
    finalAnsArr.push({id:nanoid() ,ans: newAnswers[0], held:false, guessed: ""})
   
    return finalAnsArr
}
// checks answers and sets guessed and game state
function checkAnswers () {
    const arrayCorrectAns = answers.map ((el) => {
          return el.correct
    }) 
    let answersGuessed = 0;
    let arrayAns = []
    const flatArr = ansShownScreen.flatMap(x=>x)

    for (let i=0; i<5; i++) {
      let tempArray = []
        if (arrayCorrectAns[i]=== userAns[i]) {
            answersGuessed = answersGuessed +1;

            if (flatArr[4*i].ans === userAns[i] ) {
              tempArray.push({...flatArr[4*i], guessed: "yes"})
            } else {
              tempArray.push(flatArr[4*i])
            }
    
            if (flatArr[4*i+1].ans === userAns[i] ) {
              tempArray.push({...flatArr[4*i+1], guessed: "yes"})
            } else {
              tempArray.push(flatArr[4*i+1])
            }
    
            if (flatArr[4*i+2].ans === userAns[i] ) {
              tempArray.push({...flatArr[4*i+2], guessed: "yes"})
            } else {
              tempArray.push(flatArr[4*i+2])
            }
    
            if (flatArr[4*i+3].ans === userAns[i] ) {
              tempArray.push({...flatArr[4*i], guessed: "yes"})
            } else {
              tempArray.push(flatArr[4*i+3])
            }
        } else {
          if (flatArr[4*i].ans === userAns[i] ) {
            tempArray.push({...flatArr[4*i], guessed: "no"})
          } else if (flatArr[4*i].ans === arrayCorrectAns[i]) {
            tempArray.push({...flatArr[4*i], guessed: "correctAns"})
          } else {
            tempArray.push(flatArr[4*i])
          }
  
          if (flatArr[4*i+1].ans === userAns[i] ) {
            tempArray.push({...flatArr[4*i+1], guessed: "no"})
          } else if (flatArr[4*i+1].ans === arrayCorrectAns[i]) {
            tempArray.push({...flatArr[4*i+1], guessed: "correctAns"})
          } else {
            tempArray.push(flatArr[4*i+1])
          }
  
          if (flatArr[4*i+2].ans === userAns[i] ) {
            tempArray.push({...flatArr[4*i+2], guessed: "no"})
          } else if (flatArr[4*i+2].ans === arrayCorrectAns[i]) {
            tempArray.push({...flatArr[4*i+2], guessed: "correctAns"})
          } else {
            tempArray.push(flatArr[4*i+2])
          }
  
          if (flatArr[4*i+3].ans === userAns[i] ) {
            tempArray.push({...flatArr[4*i+3], guessed: "no"})
          } else if (flatArr[4*i+3].ans === arrayCorrectAns[i]) {
            tempArray.push({...flatArr[4*i+3], guessed: "correctAns"})
          } else {
            tempArray.push(flatArr[4*i+3])
          }
        }
        arrayAns.push(tempArray)
    }
    setAnsShownScreen(prevAns => arrayAns)
    setGameWon(gameWon=> !gameWon)
    setAnsCorrect(prevValue => answersGuessed)
}

function toggle (event) {
  console.log(event.target)
    const answer = event.target.innerHTML
    const noOfQuestion = event.target.getAttribute('name')
    const newAnsArr = []
    let final
    // updates held to color field
      setAnsShownScreen(prevAns => {
              prevAns.map(ans => {
                  if (ans === ansShownScreen[noOfQuestion]){
                      const innerArr=[]
                      ans.map((el) => {
                         return el.ans === answer ? innerArr.push({id: el.id, ans: el.ans, held: !el.held, guessed: el.guessed})
                          : innerArr.push({...el, held: false})
                      })
                      newAnsArr.push(innerArr)
              } else {
                      newAnsArr.push(ans)
                  }
                  final = newAnsArr.slice(0,5)
              })
              return final
          })
          //usets user answars array
      setUserAns(prevAns => {
          const ansArray = []
          prevAns.map((elem,i) => {
            if (i == noOfQuestion) {
              return ansArray.push(answer)
            } else {
              return ansArray.push(prevAns[i])
            }
          })
          return ansArray
      })
}

// prints questions and answers to the screen
const questionScreen = ansShownScreen.map((ans, i ) => (
  
       ( <Question 
            question={questions[i].question} 
            key={questions[i].id} 
            name={questions[i].id} 
            answers={ansShownScreen[i]}
            fullAnswers={ansShownScreen}
            gameWon={gameWon}
            toggle = {toggle} />)
    
))

// draws element onto DOM
  return (
    <div>
        {(start) && (
          <div>
            <div className='container'> 
                <div className='title'>Quizzleee</div>
                <div className='info'>Check your overall knowledge?</div>
                <button className='button' onClick={changeStart}>Start Quiz</button>
              </div>
          </div> 
                 )}
        {(!start) && (ansShownScreen) && (
          <div>
            <div className='containerAnswers'> 
                {questionScreen}
                
                {gameWon && (<div>You scored {ansCorrect}/5 correct answers </div>)}
                <button className='button' onClick={gameWon? changeStart : checkAnswers}>{gameWon? "Play again" : "Check"}</button>
              </div>
          </div> 
                 )}

    </div>
  );
}

export default App;
