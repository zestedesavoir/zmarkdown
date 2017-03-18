const chai = require('chai')
const expect = require('chai').expect
const helper = require('./helper')
const glob = require('glob')
const fs = require('fs')
chai.use(helper)
const loadFixture = (filepath) => String(fs.readFileSync(filepath.replace('.txt', '.html')))

const { renderFile } = require('../')

describe('HTML rendering', function () {
  describe.only('#basic', function () {
    const files = glob.sync(`${__dirname}/fixtures/basic/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe('#extensions', function () {
    const files = glob.sync(`${__dirname}/fixtures/extensions/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })

    describe('#extra', function () {
      const files = glob.sync(`${__dirname}/fixtures/extensions/extra/*.txt`)

      files.forEach(function (filepath) {
        it(`properly renders ${filepath}`, function () {
          expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
        })
      })
    })
  })

  describe('#misc', function () {
    const files = glob.sync(`${__dirname}/fixtures/misc/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe('#options', function () {
    const files = glob.sync(`${__dirname}/fixtures/options/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })
  })

  describe('#php', function () {
    const files = glob.sync(`${__dirname}/fixtures/php/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })

    describe('#extra', function () {
      const files = glob.sync(`${__dirname}/fixtures/php/extra/*.txt`)

      files.forEach(function (filepath) {
        it(`properly renders ${filepath}`, function () {
          expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
        })
      })
    })
  })

  describe('#pl', function () {
    describe('#2004', function () {
      const files = glob.sync(`${__dirname}/fixtures/pl/Tests_2004/*.txt`)

      files.forEach(function (filepath) {
        it(`properly renders ${filepath}`, function () {
          expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
        })
      })
    })

    describe('#2007', function () {
      const files = glob.sync(`${__dirname}/fixtures/pl/Tests_2007/*.txt`)

      files.forEach(function (filepath) {
        it(`properly renders ${filepath}`, function () {
          expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
        })
      })
    })
  })

  describe('#zds', function () {
    const files = glob.sync(`${__dirname}/fixtures/zds/*.txt`)

    files.forEach(function (filepath) {
      it(`properly renders ${filepath}`, function () {
        expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
      })
    })

    describe('#extensions', function () {
      const files = glob.sync(`${__dirname}/fixtures/zds/extensions/*.txt`)

      files.forEach(function (filepath) {
        it(`properly renders ${filepath}`, function () {
          expect(renderFile(filepath)).to.have.html(loadFixture(filepath))
        })
      })
    })
  })
})
