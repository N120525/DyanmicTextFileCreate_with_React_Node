const express = require('express')
const cors = require('cors')
const app = express()
const fs = require('fs');
const path = require('path')


app.use(cors())
app.get('/', (req, res) => {
   res.send('I am good')
})

const generateRandomRealNumber = (min, max) => {
   return (Math.random() * (max - min + 1)) + min;
}

const generateRandomInteger = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomAlphbeticalString = (length) => {
   let result = '';
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   const charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const generateRandomAlphbeticalNumericStrings = (length, min, max) => {
   return generateRandomAlphbeticalString(length) + generateRandomInteger(min, max)
}


const generateRequiredData = () => {
   let reqData;

   /** it will generate the file size between 2.1MB to 2.7MB */
   // for (let i = 1; i <= 50; i++) {
   //    let outputData;
   //    let randomFunctionToCall = Math.floor(Math.random() * 4) + 1;
   //    if (randomFunctionToCall === 1) {
   //       outputData = generateRandomRealNumber(100000000.1, 100000000000.1)
   //    } else if (randomFunctionToCall === 2) {
   //       outputData = generateRandomInteger(1000000000000, 100000000000000)
   //    } else if (randomFunctionToCall === 3) {
   //       outputData = generateRandomAlphbeticalString(100000)
   //    } else if (randomFunctionToCall === 4) {
   //       outputData = generateRandomAlphbeticalNumericStrings(100000, 100000000000, 100000000000)
   //    } else {
   //       return
   //    }
   //    reqData = outputData.toString() + ',' + (reqData ? reqData : '')

   // }

   for (let i = 1; i <= 59000; i++) {
      let outputData;
      let randomFunctionToCall = Math.floor(Math.random() * 4) + 1;
      if (randomFunctionToCall === 1) {
         outputData = generateRandomRealNumber(100000000.1, 100000000000.1)
      } else if (randomFunctionToCall === 2) {
         outputData = generateRandomInteger(1000000000000, 100000000000000)
      } else if (randomFunctionToCall === 3) {
         outputData = generateRandomAlphbeticalString(50)
      } else if (randomFunctionToCall === 4) {
         outputData = generateRandomAlphbeticalNumericStrings(50, 12345, 10000000)
      } else {
         return
      }
      reqData = outputData.toString() + ',' + (reqData ? reqData : '')
   }
   return reqData
}

const writeDataToFile = async (req, res, next) => {
   const data = await generateRequiredData()
   fs.writeFile('data.txt', data, (err) => {
      if (err)
         console.log(err);
      else {
         req.fileData = data
         const stats = fs.statSync('data.txt')
         const fileSizeInBytes = stats.size;
         const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
         console.log("fileSizeInMegabytes::",fileSizeInMegabytes)
         next()
      }
   });

}

app.get('/generateData', writeDataToFile, (req, res) => {
   let fileData = req.fileData
   res.status(200).send({ status: true, message: 'file generated' ,fileData:JSON.stringify(fileData) })
})


app.get('/downloadfile', (req, res) => {
   const filePath = path.join(__dirname, 'data.txt');
   res.download(filePath)
})

const port = 8080
app.listen(port, () => {
   console.log(`app listening at http://localhost:${port}`)
})