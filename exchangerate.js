const express = require('express')
const app = express()
const http = require('http').Server(app)
const bodyParser = require('body-parser')
const fs = require('fs')
const puppeteer = require('puppeteer')

const optionPuppeteer = {
  headless : true
}

const setting = {
  url: 'https://m.shinhan.com/pages/financialInfo/exchange_rate_gold/exchange_rate.jsp',
  valid:['USD','JPY','CNY','EUR'],
  port:3001
}


const CURRENCY_NAME = 0
const SELL_PRICE = 3

const fetchRawData = async (_puppeteer, _targetUrl,_optionBrowser,_setting, _cb, _cbFinal) => {
  const _browser = await _puppeteer.launch(_optionBrowser,_setting)
  const _page = await _browser.newPage()
  await _page.goto(_targetUrl)
  await _page.waitFor(1000)



  let currencies = await _page.evaluate(selector=> {
    return [...document.querySelectorAll(selector)].map(el=>el.innerText)
  }, '#list > tr')

  let timemarked = await _page.evaluate(selector=>{
    return document.querySelector(selector).innerText
  },'.today')

  //console.log(currencies,timemarked)
  await _browser.close()
  _cb({currencies,timemarked},_setting,_cbFinal)
}


function filterCurrency(_data,_setting,_cbFinal){
  let res = _data.currencies.map(el=>
    el.split('\t')).filter(el=>_setting.valid.includes(el[CURRENCY_NAME]))
    .map(el=>{
      return {name:el[CURRENCY_NAME],
              priceSell:el[SELL_PRICE]}
    })
  _cbFinal({currencies:res,timemarked:_data.timemarked.replace('기준일시: ','')})
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//process.env.PORT for heroku
http.listen(setting.port, function(){
  console.log("server is up at " + this.address().port)
  console.log("mode:" + process.env.NODE_ENV)
})


app.use('/app.js',express.static(__dirname + '/pub/app.js'))
app.use('/app.css',express.static(__dirname + '/pub/app.css'))

app.get('/',(req,res)=>{
  fs.readFile('pub/index.html','utf8',(err,data)=>{
    res.send(data)
  })
})

app.get('/currencydata',(req,res)=>{
  fetchRawData(puppeteer,setting.url,optionPuppeteer,setting,filterCurrency,data=>{
    res.json(data)
  })
})

process.on('unhandledRejection', up => { throw up });