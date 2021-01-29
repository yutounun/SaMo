import React, { useState } from 'react';
import './App.css';
import { XYPlot, LineSeries } from "react-vis";

function App() {
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
  return (
    <div className="App">
      <header className="App-header">
        {goalLength}
      </header>
      <div className="graph_tmp">
        {results.map((result) => (
          <li key={result.date} className="result">
            {result.credit}/{result.date}/{result.category}/¥{result.cost}
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
      <button className="category" onClick={()=>{
          setCredit('クレカ')
      }}>クレカ</button>
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
      <p class="leftMoney">今週は残り¥200使えるよ！</p>
      <footer className="footer">
        <p className="footer_goal">目標</p>
        <p className="footer_top">結果</p>
        <p className="footer_record">記録</p>
      </footer>
    </div>
  );
}

export default App;

