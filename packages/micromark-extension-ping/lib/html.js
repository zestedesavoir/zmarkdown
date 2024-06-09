import { sanitizeUri } from 'micromark-util-sanitize-uri'

export default {
  enter: {
    pingCall: enterPingCall
  },
  exit: {
    pingCall: exitPingCall
  }
}

function enterPingCall () {
  this.buffer()
}

function exitPingCall () {
  const pingName = '@'.concat(this.resume())
  const url = sanitizeUri('/'.concat(pingName))

  this.tag(`<a href="${url}">`)
  this.raw(pingName)
  this.tag('</a>')
}
