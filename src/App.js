import React, { useState, useEffect } from 'react';
import firebase from 'firebase'; // 追記
import 'firebase/firestore'; // 追記
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const firebaseConfig = {
  apiKey: "AIzaSyDor3C9MPpYQwZPJgqD-gkOTk7DaA3OHgU",
  authDomain: "samo-c765d.firebaseapp.com",
  databaseURL: "https://samo-c765d-default-rtdb.firebaseio.com",
  projectId: "samo-c765d",
  storageBucket: "samo-c765d.appspot.com",
  messagingSenderId: "561064197302",
  appId: "1:561064197302:web:fdeb3ff86bf623c1847a17",
  measurementId: "G-Z4Q410EL9V"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function App() {
  const classes = useStyles();
  const [goalLength, setGoalLength] = useState("1week");
  const [credit,setCredit] = useState(false);
  const [category,categoryD] = useState("");
  const [cost,costD] = useState(""); 
  const [results, resultsD] = useState([]);
  const addInfo =()=> {
    const hiduke=new Date(); 
    const month = hiduke.getMonth()+1;
    const day = hiduke.getDate();
    const resultArr = {credit: credit, category: category, date: month+ '.' + day, cost:cost}
    const resultArray = [... results, resultArr];
    resultsD(resultArray)
    costD("")
  }
  const db = firebase.firestore();
  useEffect(() => {
    (async () => {
      const getFB = await db.collection("SaMo").doc("SaMoResults").get();
      resultsD(getFB.data().results);
    })()
  }, [db])
  useEffect(() => {
    (async () => {
      const docRef = await db.collection('SaMo').doc('SaMoResults');
      docRef.update({ results: results })
    })()
  }, [results, db])
  return (
    <div className="App">
      <header className="App-header">
        {goalLength}
      </header>
      <div className="middle">
        <Grid container spacing={3}>
          <Grid item xs={7}>
            {/* <Paper className={classes.paper}>xs=12</Paper> */}
          </Grid>
        </Grid>
        {/* <div className="graph_tmp">
          {results.map((result) => (
            <li key={result.date} className="result">
              {result.credit}/{result.date}/{result.category}/¥{result.cost}
            </li>
          ))}
        </div> */}
        <div className="categories">
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('お菓子')
          }}>お菓子</Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('飲み物')
          }}>飲み物</Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('ファッション')
          }}>ファッション</Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('ご飯')
          }}>ご飯</Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('自炊用ご飯')
          }}>自炊用ご飯</Button>
          <Button size="small" disableElevation variant="contained" className="plus">+</Button>
          <Button size="small" disableElevation variant="contained" className="minus">-</Button>
        </div>
        <Button size="medium" variant="contained" color="primary" disableElevation className="category creditCard"  onClick={()=>{
            setCredit('クレカ')
        }}>クレカ</Button>
        <span className="inputCost">¥</span>
        <input 
          type="text" 
          className="inputCost"
          value = {cost}
          placeholder="金額"
          onChange={(e) => {
            costD(e.target.value);
          }}
        />
        <Button variant="contained" size="large" disableElevation className="inputCost" onClick={() => addInfo()}>送信</Button>
        <p class="leftMoney">今週は残り¥200使えるよ！</p>
      </div>
      <footer className="footer">
        <p className="footer_goal">目標</p>
        <p className="footer_top">結果</p>
        <p className="footer_record">記録</p>
      </footer>
    </div>
  );
}

export default App;


