import React, { useState, useEffect } from 'react';
import firebase from 'firebase'; // 追記
import 'firebase/firestore'; // 追記
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Button } from '@material-ui/core';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChildCareOutlinedIcon from '@material-ui/icons/ChildCareOutlined';//おやつ
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';//交際費
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined'; //ショッピング
import FastfoodOutlinedIcon from '@material-ui/icons/FastfoodOutlined'; //外食
import KitchenOutlinedIcon from '@material-ui/icons/KitchenOutlined'; //食材
import CreditCardIcon from '@material-ui/icons/CreditCard'; //クレカ
import BarChartIcon from '@material-ui/icons/BarChart'; //チャート
import HomeIcon from '@material-ui/icons/Home';//top
import ExploreIcon from '@material-ui/icons/Explore';//目標入力
import { BrowserRouter, Route, Link } from 'react-router-dom'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

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
  const Home = () => (
    <div>
      <header>
        <div class="openSidebar">
          {['三'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div className="App-header">SaMo {goalLength}</div>
      </header>
      <div className="middle">
              <div className="categories">
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('おやつ')
          }}><ChildCareOutlinedIcon/><span className="category_title">おやつ</span></Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('交際費')
          }}><SupervisorAccountOutlinedIcon/><span className="category_title">交際費</span></Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('ショッピング')
          }}><LocalMallOutlinedIcon/><span className="category_title">ショッピング</span></Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('外食')
          }}><FastfoodOutlinedIcon/><span className="category_title">外食</span></Button>
          <Button variant="outlined" disableElevation className="category" onClick={()=>{
            categoryD('食材')
          }}><KitchenOutlinedIcon/><span className="category_title">食材</span></Button>
          <Button size="small" disableElevation variant="contained" className="plus">+</Button>
          <Button size="small" disableElevation variant="contained" className="minus">-</Button>
        </div>
        <div className="creditNcost">
          <Button size="medium" variant="contained" color="primary" disableElevation className="category creditCard"  onClick={()=>{
              setCredit('クレカ')
          }}><CreditCardIcon/><span className="category_title">クレカ</span></Button>
          <span className="yen">¥</span>
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
        </div>
        <p class="leftMoney">今週は残り<span className="leftCost">¥{leftCost}</span>使えるよ！</p>
      </div>
    </div>
  )
  const Goal = () => (
    <div>
      <header>
        <div class="openSidebar">
          {['三'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div className="App-header">SaMo {goalLength}</div>
      </header>
      <h2>目標</h2>
      <input 
        type="text" 
        className="inputCost"
        value = {leftCost}
        placeholder="金額"
        onChange={(e) => {
          setleftCost(e.target.value);
        }}
      />
      <Button variant="contained" size="large" disableElevation className="inputCost">送信</Button>
    </div>
  )
  const Graph = () => (
    <div>
      <header>
        <div class="openSidebar">
          {['三'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div className="App-header">SaMo {goalLength}</div>
      </header>
      <h2>グラフ</h2>
      <p>ここにフレンズのグラフを書きます</p>
    </div>
  )
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button key='TOP'>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <Link to='/'><ListItemText primary='TOP' /></Link>
        </ListItem>
        <ListItem button key='目標'>
          <ListItemIcon><ExploreIcon /></ListItemIcon>
          <Link to='/Goal'><ListItemText primary='目標' /></Link>
        </ListItem>
        <ListItem button key='レポート'>
          <ListItemIcon><BarChartIcon /></ListItemIcon>
          <Link to='/Graph'><ListItemText primary='レポート' /></Link>
        </ListItem>
      </List>
    </div>
  );
  const classes = useStyles();
  const [goalLength, setGoalLength] = useState("");
  const [credit,setCredit] = useState(false);
  const [category,categoryD] = useState("");
  const [cost,costD] = useState(""); 
  const [results, resultsD] = useState([]);
  const [leftCost, setleftCost] = useState("??"); //使用可能金額
  const addInfo =()=> {
    const hiduke=new Date(); 
    const month = hiduke.getMonth()+1;
    const day = hiduke.getDate();
    const resultArr = {credit: credit, category: category, date: month+ '.' + day, cost:cost}
    const resultArray = [... results, resultArr];
    resultsD(resultArray)
    costD("")
    resultArray.map((result) => {
      setleftCost(leftCost-result.cost);//使用可能金額の算出
    })
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
      <BrowserRouter>
        <div>
          <Route exact path='/' component={Home} />
          <Route path='/Goal' component={Goal} />
          <Route path='/Graph' component={Graph} />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;


