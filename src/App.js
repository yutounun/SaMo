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

//firebase設定
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
    // useStatesの変数一覧
    const inputCost = React.useRef()  //input連続入力機能
    const LeftCost = React.useRef()  //input連続入力機能
    const classes = useStyles();
    const [goalCost, setGoalCost] = useState(0);
    const [credit,setCredit] = useState(false); //クレカ利用選択ならtrue
    const [category,categoryD] = useState("");// 選択済みカテゴリ
    const [totalPayment, settotalPayment] = useState();// 今月支払い合計
    const [results, resultsD] = useState([]);// 入力結果
    const [DataTable, setDataTable] = useState([
      { 日付: "", カテゴリ: "", 利用金額: "" }
    ]);
    const [CreditTotal, setCreditTotal] = useState(0);
    const [leftCost, setleftCost] = useState(""); //使用可能金額
    const [Data, setData] = useState(// グラフデータ初期値
      [
        {index: 0, name: 'おやつ', value: 0,},
        {index: 1, name: '交際費', value: 0,},
        {index: 2, name: 'ショッピング', value: 0,},
        {index: 3, name: '外食', value: 0,},
        {index: 4, name: '食材', value: 0,}
      ]
    );

  //TOP page
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
        </div>
        <div className="creditNcost">
          <span className="yen">¥</span>
          <input 
            type="text" 
            className="inputCost"
            placeholder="金額"
            ref={inputCost}
          />
          <Button size="medium" variant="contained" color="primary" disableElevation className="phone category creditCard"  onClick={()=>{
            setCredit(true)
          }}><CreditCardIcon/><span className="category_title">クレカ</span></Button>
          <Button variant="contained" size="large" disableElevation className="inputCost" onClick={addInfo}>送信</Button>
        </div>
        <p className="leftMoney">今週は残り<span className="leftCost">¥{leftCost}</span>使えるよ！</p>
        <p className="leftMoney">
          <Button variant="contained" size="large" disableElevation color='secondary'className="inputCost, delete" onClick={bomb}>データ削除</Button>  
        </p>
      </div>
    </div>
  )

  //目標ページ
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
      <div className="goal">
        <span className="yen">¥</span>
        <input 
          type="text" 
          className="inputCost inputGoal"
          placeholder="金額"
          ref={LeftCost}
        />
        <Button variant="contained" size="large" disableElevation className="inputCost sendGoal" onClick={ setGoal }>送信</Button>
        <p className="leftMoney">今回の目標は<span className="leftCost">¥{goalCost}</span>です！
        <br/>頑張りましょう！</p>
      </div>
    </div>
  )

  //レポートページ
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
          <PieChart width={380} height={300}>
            <Pie data={Data} dataKey="value" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label={label}>
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
          </div>
        </div>
        <h4 className="displayCreditTotal">今週は合計¥{CreditTotal}利用済み</h4>
      </div>
    </div>
  )

  //table機能
  const tableStyle = {
    width: "100%",
    margin: "0 auto",
    marginTop: 10,
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
        <Text x={x} y={y} fill="#82ca9d">{name}</Text>
        <Text x={x} y={y} dominantBaseline="hanging" fill="#82ca9d">{"¥"+value}</Text>
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
  
  //目標金額の入力値を残高にセット
  const setGoal=()=>{
    //leftcostにいれる
    setleftCost(LeftCost.current.value)
    const currentLeftCost = LeftCost.current.value //そのままではsetできてないから変数に入れてからlocalStorageにいれる
    localStorage.setItem('leftCost',currentLeftCost);

    //goalcostにいれる
    setGoalCost(LeftCost.current.value)
    const currentGoalCost = LeftCost.current.value //そのままではsetできてないから変数に入れてからlocalStorageにいれる
    localStorage.setItem('goalCost',currentGoalCost);
  }

  //localData削除
  const bomb=()=>{
    localStorage.clear()
    readLocal()
  }

  //ローカルストレージ関数
  const readLocal=()=>{
    const localCredit = JSON.parse(localStorage.getItem('creditTotal'))
    const localLeftCost = JSON.parse(localStorage.getItem('leftCost'))
    const localAll = JSON.parse(localStorage.getItem('info'))
    const goalLocal =JSON.parse(localStorage.getItem('goalCost'))
    const localTable = []
    var localTotalSpent = JSON.parse(localStorage.getItem('total'));
    let a = 
    [
      {index: 0, name: 'おやつ', value: 0,},
      {index: 1, name: '交際費', value: 0,},
      {index: 2, name: 'ショッピング', value: 0,},
      {index: 3, name: '外食', value: 0,},
      {index: 4, name: '食材', value: 0,}
    ]

    if(localAll){
      localAll.map((local)=>{
        console.log(localTotalSpent)
        local.cost = parseInt(local.cost) //コストをintに
        if(local.credit){
          localTable.push({ 日付: local.date, カテゴリ: local.category, 利用金額: '¥' + local.cost })
        }

        //グラフにdata代入
        if(local.category==="おやつ"){
          a[0].value += local.cost
        }else if(local.category==="交際費"){
          a[1].value += local.cost
        }else if(local.category==="ショッピング"){
          a[2].value += local.cost
        }else if(local.category==="外食"){
          a[3].value += local.cost
        }else if(local.category==="食材"){
          a[4].value += local.cost
        }
      })
    }
    setData(a);
    setGoalCost(goalLocal)
    setCreditTotal(localCredit)
    settotalPayment(localTotalSpent)
    setleftCost(localLeftCost)
    resultsD(results.concat(localAll))
    setDataTable(DataTable.concat(localTable))
  }

  //入力情報詳細をlocalStorageに保存
  const setLocalInfo=(resultArray)=>{
    const x = resultArray.filter(v => v)
    if(x){
      localStorage.setItem('info',JSON.stringify(x));
    }
  }

  // 追加情報選択後送信
  const addInfo =()=> {
    setCredit(false) // 送信時にfalseにすることでtrueのみテーブルに乗るときのバグを防ぐ
    const hiduke=new Date(); 
    const month = hiduke.getMonth()+1;
    const day = hiduke.getDate();
    const resultArr = {credit: credit, category: category, date: month+ '.' + day, cost:parseInt(inputCost.current.value)}
    const resultArray = [... results, resultArr]
    setLocalInfo(resultArray)
    resultsD(resultArray) //この時まだresultsにsetされていないのはあるあるだからresultArrayを使うのが適切。

    //今週の残高ローカル更新
    const allLeft = leftCost-parseInt(inputCost.current.value)
    localStorage.setItem('leftCost',JSON.stringify(allLeft)); 
    setleftCost(leftCost-parseInt(inputCost.current.value)) //leftCost更新

    //合計使用額
    let localTotal = JSON.parse(localStorage.getItem('total'))
    if (totalPayment){
      localTotal = parseInt(totalPayment) + parseInt(inputCost.current.value)
    }else {
      localTotal = parseInt(inputCost.current.value)
    }
    console.log(localTotal)
    settotalPayment(localTotal)
    localStorage.setItem('total', JSON.stringify(localTotal)); 

    //クレカ合計使用額
    let localCreditTotal = JSON.parse(localStorage.getItem('creditTotal'))
    if (CreditTotal){
      localCreditTotal = parseInt(CreditTotal) + parseInt(inputCost.current.value)
    }else {
      localCreditTotal = parseInt(inputCost.current.value)
    }

    if(credit){// trueのみテーブルに乗るときのバグを防ぐ
      setDataTable(DataTable.concat({ 日付: month+ '.' + day, カテゴリ: category, 利用金額: '¥' + parseInt(inputCost.current.value) },))
      setCreditTotal(CreditTotal + parseInt(inputCost.current.value))
      localStorage.setItem('creditTotal',JSON.stringify(localCreditTotal));
    }
    if(resultArray){
      resultArray.map((result, index) => {
        if(result === null)return
        result.cost = parseInt(result.cost)
        //各選択されたカテゴリ以外はデータをそのままに、選択のもののみデータを追加してグラフに反映させる
        if(result.category==="おやつ"){
          setData([
            {index: 0,name: 'おやつ',value: Data[0].value+result.cost,},
            {index: index,name: "交際費",value: Data[1].value,},
            {index: index,name: "ショッピング",value: Data[2].value,},
            {index: index,name: "外食",value: Data[3].value,},
            {index: index,name: "食材",value: Data[4].value,},
        ]);
        }else if(result.category==="交際費"){
          setData([
              {index: 0,name: 'おやつ',value: Data[0].value,},
              {index: index,name: "交際費",value: Data[1].value+result.cost,},
              {index: index,name: "ショッピング",value: Data[2].value,},
              {index: index,name: "外食",value: Data[3].value,},
              {index: index,name: "食材",value: Data[4].value,
            },
          ]);
        }else if(result.category==="ショッピング"){
          setData([
            {index: 0,name: 'おやつ',value: Data[0].value,},
            {index: index,name: "交際費",value: Data[1].value,},
            {index: index,name: "ショッピング",value: Data[2].value+result.cost,
            },
            {index: index,name: "外食",value: Data[3].value,},
            {index: index,name: "食材",value: Data[4].value,},
          ]);
        }else if(result.category==="外食"){
          setData([
            {index: 0,name: 'おやつ',value: Data[0].value,},
            {index: index,name: "交際費",value: Data[1].value,},
            {index: index,name: "ショッピング",value: Data[2].value,},
            {index: index,name: "外食",value: Data[3].value+result.cost,},
            {index: index,name: "食材",value: Data[4].value,},
          ]);
        }else if(result.category==="食材"){
          setData([
            {index: 0,name: 'おやつ',value: Data[0].value,},
            {index: index,name: "交際費",value: Data[1].value,},
            {index: index,name: "ショッピング",value: Data[2].value,},
            {index: index,name: "外食",value: Data[3].value,},
            {index: index,name: "食材",value: Data[4].value+result.cost,},
          ]);
        }
      })
    }
  }

  //第二引数指定でDOM描画時のみ関数実行
  useEffect(() => {
    readLocal()
  }, []);



  //ここで全ての内容をDOM表示
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


