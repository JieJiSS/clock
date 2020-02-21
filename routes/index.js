const router = require('koa-router')()
const argv = require("yargs").argv

let baseForkedTimestamp = Date.now() / 1000
let forkedTimestamp = baseForkedTimestamp
let baseRealTimestamp = Date.now() / 1000
let forkedRate = 1

router.get('/', async (ctx) => {
  await ctx.render('index', {
    date: String(getForkedDate()),
    time: getForkedTime(),
  })
})

router.get('/startTheTimer', async (ctx) => {
  baseRealTimestamp = Math.round(Date.now() / 1000)
  forkedRate = 6
  ctx.redirect('/')
})

router.get('/stopTheTimer', async (ctx) => {
  forkedRate = 0
  baseRealTimestamp = Math.round(Date.now() / 1000)
  baseForkedTimestamp = forkedTimestamp
  ctx.redirect('/')
})

router.get('/timestamp', async (ctx) => {
  ctx.type = ".json"
  ctx.body = '{"timestamp":' + Math.round(forkedTimestamp * 1000) + '}'
})

;function getForkedDate() {
  const d = new Date(forkedTimestamp * 1000);
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
}

;function getForkedTime() {
  const ts = new Date(forkedTimestamp * 1000);
  return `${pad(ts.getHours())}:${pad(ts.getMinutes())}:${pad(ts.getSeconds())}`
}

setInterval(function () {
  forkedTimestamp = Math.round(baseForkedTimestamp + (Date.now() / 1000 - baseRealTimestamp) * forkedRate)
}, 100)

;function pad(str) {
  str = String(str)
  return str.length < 2 ? '0' + str : str
}

module.exports = router
