import React, { useState } from 'react';
import './App.css';
import { XYPlot, LineSeries } from "react-vis";

function App() {
  // const [value, setvalue] = useState("");
  const [goalLength, setGoalLength] = useState("1week");
  const [category,categoryD] = useState("");
  const [date,dateD] = useState("");
  const [cost,costD] = useState(""); 
  const [results, resultsD] = useState([]);
  const addInfo =()=> {
    const resultArr = {category: category, date: date, cost:cost}
    const resultArray = [... results, resultArr];
    resultsD(resultArray)
    costD("")
    dateD("")
  }
  return (
    <div className="App">
      <header className="App-header">
        {goalLength}
      </header>
      <div className="graph">graph</div>
      <div className="graph_tmp">
        {results.map((result) => (
          <li key={result.date} className="result">
            {result.date}/{result.category}/¥{result.cost}
          </li>
        ))}
      </div>
      <div className="categories">
        <button className="category" onClick={()=>{
          categoryD('お菓子')
        }}>お菓子</button>
        <button className="category" onClick={()=>{
          categoryD('飲み物')
        }}>飲み物</button>
        <button className="category" onClick={()=>{
          categoryD('ファッション')
        }}>ファッション</button>
        <button className="category" onClick={()=>{
          categoryD('ご飯')
        }}>ご飯</button>
        <button className="category" onClick={()=>{
          categoryD('自炊用ご飯')
        }}>自炊用ご飯</button>
        <button className="category" onClick={()=>{
          categoryD('その他')
        }}>その他</button>
        <button>+</button>
        <button>-</button>
      </div>
      {/* <span>datepicker</span> */}
      <input 
        type="text" 
        placeholder="日付"
        className="inputDate"
        value = {date}
        onChange={(e) => {
          dateD(e.target.value);
        }}
      />
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
      <button className="inputCost" onClick={() => addInfo()}>送信</button>
      <footer className="footer">
        <p className="footer_goal">目標</p>
        <p className="footer_top">結果</p>
        <p className="footer_record">記録</p>
      </footer>
    </div>
  );
}

export default App;

