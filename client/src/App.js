import './App.css';
import React from 'react'
import axios from 'axios'
const ApiURL = "http://localhost:8080"

function App() {
  const [data, setData] = React.useState(null)
  const [isShowReport, setIsShowReport] = React.useState(false)
  const [fileData, setFileData] = React.useState(null)
  const [isfileAvaliable, setIsfileAvaliable] = React.useState(false)

  const [aphanumaricCount, setAphanumaricCount] = React.useState(0)
  const [integerCount, setIntegerCount] = React.useState(0)
  const [alphbeticalStringCount, setAlphbeticalStringCountCount] = React.useState(0)
  const [realNumberCount, setRealNumberCount] = React.useState(0)

  const getData = (eve) => {
    setData(eve.target.value)
    console.log(eve.target.value)
  }

  const getReport = () => {
    setAphanumaricCount(0)
    setIntegerCount(0)
    setAlphbeticalStringCountCount(0)
    setRealNumberCount(0)
    const isAphanumaric = new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$');
    const isInteger = new RegExp('^[0-9]+$');
    const isAlphbeticalString = new RegExp('^[a-zA-Z]+$')
    const isRealNumber = new RegExp("^([0-9]+[.|,][0-9])|([0-9][.|,][0-9]+)|([0-9]+)$");

    setIsShowReport(true)
    const reportData = fileData && fileData.split(',')
    reportData && reportData.forEach(ele => {
      if (isAphanumaric.test(ele)) {
        setAphanumaricCount(prev => prev + 1)
      } else if (isInteger.test(ele)) {
        setIntegerCount(prev => prev + 1)
      } else if (isAlphbeticalString.test(ele)) {
        setAlphbeticalStringCountCount(prev => prev + 1)
      } else if (isRealNumber.test(ele)) {
        setRealNumberCount(prev => prev + 1)
      } else {
       return;
      }
    })
  }


  const generateFile = () => {
    axios.get(ApiURL + '/generateData')
      .then(res => {
        setIsfileAvaliable(res.data.status)
        setFileData(JSON.parse(res.data.fileData))
      }).catch(err => {
        console.log("Error::", err)
      })
  }

  const downloadFile = (eve) => {
    eve.preventDefault()
    axios.get(ApiURL + '/downloadfile')
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.txt');
        document.body.appendChild(link);
        link.click();
      })
  }

  return (
    <div className="App">
      {/* <textarea className="tetxare" onChange={getData} placeholder="please Enter the objects you want">
      </textarea> */}
      <div>
        <button className="btn" onClick={generateFile}>Generate</button>
      </div>
      {isfileAvaliable &&
        <div style={{margin:10}} >
          {/* <button className="btn" onClick={downloadFile}>download file</button> */}
          <a  href="" onClick={downloadFile} >click-her-to/downlaod</a>
        </div>
      }

      <div>
        <button disabled={!isfileAvaliable} className="btn" onClick={getReport}>Report</button>
      </div>
      {isShowReport &&
        <div>
          <p>
            Alphbetical string : {alphbeticalStringCount}
          </p>
          <p>
            Real numbers : {realNumberCount}
          </p>
          <p>
            Integers : {integerCount}
          </p>
          <p>
            Alphanumeric : {aphanumaricCount}
          </p>
        </div>
      }
    </div>
  );
}

export default App;
