import React, { useState, useEffect } from 'react';
import firebase from 'firebase'; // 追記
import 'firebase/firestore'; // 追記
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

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
        {['TOP', '目標入力', '結果'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [goalLength, setGoalLength] = useState("1週間");
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
        <div className="App-header">SaMo {goalLength}計画</div>
      </header>
      <div className="middle">
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
        <div className="creditNcost">
          <Button size="medium" variant="contained" color="primary" disableElevation className="category creditCard"  onClick={()=>{
              setCredit('クレカ')
          }}>クレカ</Button>
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
        <p class="leftMoney">今週は残り<span className="leftCost">¥200</span>使えるよ！</p>
      </div>
    </div>
  );
}

export default App;


