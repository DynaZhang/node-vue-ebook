const express = require('express');
const Cryptos = require('crypto-js');
const webSocket = require('ws');
const VOICE_CONFIG = require('../config/voice');

const router = express.Router();

function getAuthUrl() {
  const host = location.host;
  const currentDate = new Date().toGMTString();
  const algorithm = 'hmac-sha256';
  const headers = 'host date request-line';
  const signatureOrigin = `host: ${host}\ndate: ${currentDate}\nGET /v2/tts HTTP/1.1`;
  const signatureSha = Cryptos.HmacSHA256(signatureOrigin,VOICE_CONFIG.API_SECRET);
  const signature = Cryptos.enc.Base64.stringify(signatureSha);
  const authorizationOrigin = `api_key="${VOICE_CONFIG.API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
  const authorization = Cryptos.enc.Base64.stringify(authorizationOrigin);
  const reqUrl = `${VOICE_CONFIG.URL}?authorization=${authorization}&date=${currentDate}&host=${host}`
  return reqUrl;
}

function createWebSocket(url, text, lang) {
  let ws = new webSocket(url);
  ws.onopen = (e) => {
    let params = {
      common: {
        app_id: VOICE_CONFIG.APP_ID
      },
      business: {
        ent: lang === 'cn' ? 'intp_65' : 'intp_65_cn',
        aue: 'raw',
        auf: 'audio/L16;rate=16000',
        vcn: 'xiaoyan',
        speed: 30,
        volume: 50,
        ptich: 50,
        bgs: 0,
        tte: 'UTF8'
      },
      data: {
        text: Cryptos.enc.Base64(text),
        status: 2
      }
    };
    ws.send(JSON.stringify(params));
  }

  ws.onmessage = (e) => {
    let jsonData = JSON.parse(e.data)
    // 合成失败
    if (jsonData.code !== 0) {
      alert(`${jsonData.code}:${jsonData.message}`)
      ws.close();
      return
    }
    // self.pcmPlayWork.postMessage({
    //   command: 'transData',
    //   data: jsonData.data.audio
    // })

    if (jsonData.code === 0 && jsonData.data.status === 2) {
      ws.close()
    }
  }
  ws.onerror = (e) => {
    console.log(e)
    console.log(e.data)
  }
  ws.onclose = (e) => {
    console.log(e)
  }
}

function createVoice(req, res) {
  const text = req.query.text;
  const lang = req.query.lang;

  const reqUrl = getAuthUrl();
  createWebSocket(reqUrl,lang,text);
}

router.get('/voice', (req,res) => {
  createVoice(req,res)
});

module.exports = router;
