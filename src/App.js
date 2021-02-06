import React, { useState, useEffect } from 'react';
import ReactFlexyTable from "react-flexy-table" //テーブル
import "react-flexy-table/dist/index.css" //テーブル
import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/firestore' // ここには使用するFirebaseSDKモジュールを記載
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
import { BrowserRouter, Route, Link } from 'react-router-dom' // ルーティング
import { PieChart, Pie, Text, Cell } from 'recharts' //チャート

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
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const inputCost = React.useRef()
  const Home = () => (
    <div>
      <header>
        <div className="openSidebar">
          {['三'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div className="App-header">SaMo</div>
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
              setCredit(true)
          }}><CreditCardIcon/><span className="category_title">クレカ</span></Button>
          <span className="yen">¥</span>
          {/* <input 
            type="text" 
            className="inputCost"
            value = {cost}
            placeholder="金額"
            onChange={(e) => {
              costD(e.target.value);
            }}/> */}
            <input 
              type="text" 
              className="inputCost"
              placeholder="金額"
              ref={inputCost}
            />
          <Button variant="contained" size="large" disableElevation className="inputCost" onClick={addInfo}>送信</Button>
        </div>
        <p className="leftMoney">今週は残り<span className="leftCost">¥{leftCost}</span>使えるよ！</p>
      </div>
    </div>
  )
  const Goal = () => (
    <div>
      <header>
        <div className="openSidebar">
          {['三'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div className="App-header">SaMo</div>
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
        <div className="openSidebar">
          {['三'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div className="App-header">SaMo</div>
      </header>
      <div className="graphPage">
        <div className="graph">
          <h3>カテゴリ別利用金額</h3>
          <PieChart width={700} height={400}>
            <Pie data={Data} dataKey="value" cx="50%" cy="50%" outerRadius={150} fill="#82ca9d" label={label}>
            {
              Data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
            }
            </Pie>
          </PieChart>
          <p>今週は合計¥{totalPayment}利用済み</p>
        </div>
        <div className="table">
          <h3>クレカ利用明細</h3>
          <div className="App">
            <div style={tableStyle}>
              <ReactFlexyTable data={DataTable} />
            </div>
            <h4 className="displayCreditTotal">今週は合計¥{CreditTotal}利用済み</h4>
          </div>
        </div>
      </div>
    </div>
  )
  const tableStyle = {
    width: "100%",
    margin: "0 auto",
    marginTop: 70,
  };
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red'];
  const label = ({ name, value, cx, x, y }) => {
    const textAnchor = x > cx ? "start" : "end";
    return (
      <>
        <Text x={x} y={y} textAnchor={textAnchor} fill="#82ca9d">
          {name}
        </Text>
        <Text
          x={x}
          y={y}
          dominantBaseline="hanging"
          textAnchor={textAnchor}
          fill="#82ca9d"
        >
          {"¥"+value}
        </Text>
      </>
    );
  };
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
  const [credit,setCredit] = useState(false);
  const [category,categoryD] = useState("");
  const [totalPayment, settotalPayment] = useState(0);
  // const [cost,costD] = useState(""); 
  const [results, resultsD] = useState([]);
  const [DataTable, setDataTable] = useState([
    { 日付: "", カテゴリ: "", 利用金額: "" }
  ]);
  const [CreditTotal, setCreditTotal] = useState(0);
  const [leftCost, setleftCost] = useState(""); //使用可能金額
  const [Data, setData] = useState(
    [
      {
        index: 0,
        name: 'おやつ',
        value: 0,
      },
      {
        index: 1,
        name: '交際費',
        value: 0,
      },
      {
        index: 2,
        name: 'ショッピング',
        value: 0,
      },
      {
        index: 3,
        name: '外食',
        value: 0,
      },
      {
        index: 4,
        name: '食材',
        value: 0,
      }
    ]
  );
  
  const addInfo =()=> {
    // console.log(inputCost.current.value)
    const hiduke=new Date(); 
    const month = hiduke.getMonth()+1;
    const day = hiduke.getDate();
    const resultArr = {credit: credit, category: category, date: month+ '.' + day, cost:inputCost.current.value}
    const resultArray = [... results, resultArr]
    resultsD(resultArray)
    // costD("")
    resultArray.map((result, index) => {
      result.cost = parseInt(result.cost)
      if(result.credit){
        setDataTable(DataTable.concat({ 日付: result.date, カテゴリ: result.category, 利用金額: '¥' + result.cost },))
        setCreditTotal(CreditTotal + result.cost)
      }
        if(result.category==="おやつ"){
          setData([
          {
            index: 0,
            name: 'おやつ',
            value: Data[0].value+result.cost,
          },
          {
            index: index,
            name: "交際費",
            value: Data[1].value,
          },
          {
            index: index,
            name: "ショッピング",
            value: Data[2].value,
          },
          {
            index: index,
            name: "外食",
            value: Data[3].value,
          },
          {
            index: index,
            name: "食材",
            value: Data[4].value,
          },
        ]);
        }else if(result.category==="交際費"){
          setData([
            {
              index: 0,
              name: 'おやつ',
              value: Data[0].value,
            },
            {
              index: index,
              name: "交際費",
              value: Data[1].value+result.cost,
            },
            {
              index: index,
              name: "ショッピング",
              value: Data[2].value,
            },
            {
              index: index,
              name: "外食",
              value: Data[3].value,
            },
            {
              index: index,
              name: "食材",
              value: Data[4].value,
            },
          ]);
        }else if(result.category==="ショッピング"){
          setData([
            {
              index: 0,
              name: 'おやつ',
              value: Data[0].value,
            },
            {
              index: index,
              name: "交際費",
              value: Data[1].value,
            },
            {
              index: index,
              name: "ショッピング",
              value: Data[2].value+result.cost,
            },
            {
              index: index,
              name: "外食",
              value: Data[3].value,
            },
            {
              index: index,
              name: "食材",
              value: Data[4].value,
            },
          ]);
        }else if(result.category==="外食"){
          setData([
            {
              index: 0,
              name: 'おやつ',
              value: Data[0].value,
            },
            {
              index: index,
              name: "交際費",
              value: Data[1].value,
            },
            {
              index: index,
              name: "ショッピング",
              value: Data[2].value,
            },
            {
              index: index,
              name: "外食",
              value: Data[3].value+result.cost,
            },
            {
              index: index,
              name: "食材",
              value: Data[4].value,
            },
          ]);
        }else if(result.category==="食材"){
          setData([
            {
              index: 0,
              name: 'おやつ',
              value: Data[0].value,
            },
            {
              index: index,
              name: "交際費",
              value: Data[1].value,
            },
            {
              index: index,
              name: "ショッピング",
              value: Data[2].value,
            },
            {
              index: index,
              name: "外食",
              value: Data[3].value,
            },
            {
              index: index,
              name: "食材",
              value: Data[4].value+result.cost,
            },
          ]);
        }
      settotalPayment(parseInt(totalPayment) + result.cost)
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


