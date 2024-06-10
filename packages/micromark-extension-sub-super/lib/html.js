export default {
  enter: {
    subString: enterSubData,
    superString: enterSuperData
  },
  exit: {
    subString: exitSubData,
    superString: exitSuperData
  }
}

function enterSubData () {
  this.tag('<sub>')
}

function enterSuperData () {
  this.tag('<sup>')
}

function exitSubData () {
  this.tag('</sub>')
}

function exitSuperData () {
  this.tag('</sup>')
}
