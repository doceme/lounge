/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
var _ = require('lodash')
var async = require('async')
var testUtil = require('./helpers/utils')
var expect = require('chai').expect
var lounge = require('../')

var bucket

describe('Model index query tests', function () {
  describe('single index query tests without populate', function () {
    beforeEach(function (done) {
      var t = process.env.LOUNGE_COUCHBASE_MOCK ? 10 : 100
      setTimeout(() => {
        if (lounge) {
          lounge.disconnect()
        }

        lounge = new lounge.Lounge() // recreate it

        var cluster = testUtil.getCluser()
        bucket = cluster.openBucket('lounge_test', function (err) {
          if (err) {
            return done(err)
          }

          lounge.connect({
            bucket: bucket
          }, function () {
            bucket.manager().flush(done)
          })
        })
      }, t)
    })

    it('should query using simple reference document', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true }
      })

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmail(user.email, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          done()
        })
      })
    })

    it('should query using simple reference document with a long index value', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true }
      })

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmith@gmail.com'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmail(user.email, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          done()
        })
      })
    })

    it('should query using compound indexes', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: String,
        username: String
      })

      userSchema.index(['email', 'username'])

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com',
        username: 'jsmith'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmailAndUsername(user.email, user.username, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)
          expect(rdoc.username).to.equal(userData.username)

          done()
        })
      })
    })

    it('should query using compound indexes and a long index value', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: String,
        username: String
      })

      userSchema.index(['email', 'username'])

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmithjoesmith@gmail.com',
        username: 'jsmith'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmailAndUsername(user.email, user.username, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)
          expect(rdoc.username).to.equal(userData.username)

          done()
        })
      })
    })

    it('should query using compound indexes with nested values', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: String,
        company: {
          name: String
        }
      })

      userSchema.index(['email', 'company.name'])

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com',
        company: {
          name: 'Acme Inc'
        }
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmailAndCompanyName(user.email, user.company.name, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)
          expect(rdoc.company).to.be.ok
          expect(rdoc.company).to.be.an('object')
          expect(rdoc.company.name).to.equal(userData.company.name)

          done()
        })
      })
    })

    it('should query using compound indexes of type array with nested values', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: String,
        company: {
          name: String
        }
      })

      userSchema.index(['email', 'company.name'], { indexType: 'array' })

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com',
        company: {
          name: 'Acme Inc'
        }
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        setTimeout(() => {
          User.findByEmailAndCompanyName(user.email, user.company.name, function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an('array')
            expect(rdoc.length).to.equal(1)

            expect(rdoc[0]).to.be.an('object')
            expect(rdoc[0]).to.be.an.instanceof(User)
            expect(rdoc[0].id).to.be.ok
            expect(rdoc[0].id).to.be.a('string')

            expect(rdoc[0].id).to.equal(user.id)
            expect(rdoc[0].firstName).to.equal(userData.firstName)
            expect(rdoc[0].lastName).to.equal(userData.lastName)
            expect(rdoc[0].email).to.equal(userData.email)
            expect(rdoc[0].company).to.be.ok
            expect(rdoc[0].company).to.be.an('object')
            expect(rdoc[0].company.name).to.equal(userData.company.name)

            var userData2 = {
              firstName: 'Joe2',
              lastName: 'Smith2',
              email: 'joe@gmail.com',
              company: {
                name: 'Acme Inc'
              }
            }

            var user2 = new User(userData2)

            user2.save(function (err, savedDoc) {
              expect(err).to.not.be.ok
              expect(savedDoc).to.be.ok

              setTimeout(() => {
                User.findByEmailAndCompanyName(user2.email, user2.company.name, function (err, rdoc) {
                  expect(err).to.not.be.ok

                  expect(rdoc).to.be.ok
                  expect(rdoc).to.be.an('array')
                  expect(rdoc.length).to.equal(2)

                  expect(rdoc[1]).to.be.an('object')
                  expect(rdoc[1]).to.be.an.instanceof(User)
                  expect(rdoc[1].id).to.be.ok
                  expect(rdoc[1].id).to.be.a('string')

                  expect(rdoc[1].id).to.equal(user2.id)
                  expect(rdoc[1].firstName).to.equal(userData2.firstName)
                  expect(rdoc[1].lastName).to.equal(userData2.lastName)
                  expect(rdoc[1].email).to.equal(userData2.email)
                  expect(rdoc[1].company).to.be.ok
                  expect(rdoc[1].company).to.be.an('object')
                  expect(rdoc[1].company.name).to.equal(userData2.company.name)

                  done()
                })
              })
            })
          })
        }, 50)
      })
    })

    it('should query using simple reference document using promises', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true }
      })

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmail(user.email).then(function (rdoc) {
          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          done()
        })
      })
    })

    it('should query using simple reference document using lean option', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true }
      })

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmail(user.email, { lean: true }, function (err, rdoc) {
          expect(err).to.not.be.ok
          expect(rdoc).to.be.ok
          expect(rdoc).to.be.a('string')

          expect(rdoc).to.equal(user.id)

          done()
        })
      })
    })

    it('should query using compound index using lean option', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: String,
        username: String
      })

      userSchema.index(['email', 'username'])

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com',
        username: 'jsmith'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmailAndUsername(user.email, user.username, { lean: true }, function (err, rdoc) {
          expect(err).to.not.be.ok
          expect(rdoc).to.be.ok
          expect(rdoc).to.be.a('string')

          expect(rdoc).to.equal(user.id)

          done()
        })
      })
    })

    it('should query using simple reference document respecting key options', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true },
        username: { type: String, key: true, generate: false }
      })

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com',
        username: 'jsmith'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmail(user.email, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)

          expect(rdoc.username).to.equal(user.username)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          done()
        })
      })
    })

    it('should query using simple reference document respecting ref key case', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true, refKeyCase: 'lower' }
      })

      var User = lounge.model('User', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com'
      }

      var user = new User(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmail(user.email, function (err, rdoc) {
          expect(err).to.not.be.ok
          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)

          expect(rdoc.username).to.equal(user.username)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          // Index query functions should now be case insensitive
          User.findByEmail('JoE@GmaIl.COM', function (err, rdoc2) {
            expect(err).to.not.be.ok
            expect(rdoc2).to.be.ok
            expect(rdoc2).to.be.an('object')
            expect(rdoc2).to.be.an.instanceof(User)

            expect(rdoc2.username).to.equal(user.username)
            expect(rdoc2.firstName).to.equal(userData.firstName)
            expect(rdoc2.lastName).to.equal(userData.lastName)
            expect(rdoc2.email).to.equal(userData.email)

            done()
          })
        })
      })
    })

    it('should query index values for array', function (done) {
      var userSchema = new lounge.Schema({
        firstName: String,
        lastName: String,
        usernames: [{ type: String, index: true, indexName: 'username' }]
      })

      var User = lounge.model('User', userSchema)

      var user = new User({
        firstName: 'Joe',
        lastName: 'Smith',
        usernames: ['user1', 'user2']
      })

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByUsername(user.usernames[0], function (err, rdoc, missing) {
          expect(err).to.not.be.ok
          expect(missing).to.eql([])

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)

          var actual = rdoc.usernames.sort()
          var expected = user.usernames.sort()

          expect(actual).to.eql(expected)
          expect(rdoc.firstName).to.equal(user.firstName)
          expect(rdoc.lastName).to.equal(user.lastName)
          expect(rdoc.email).to.equal(user.email)

          User.findByUsername(user.usernames[1], function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an('object')
            expect(rdoc).to.be.an.instanceof(User)

            var actual = rdoc.usernames.sort()
            var expected = user.usernames.sort()

            expect(actual).to.eql(expected)
            expect(rdoc.firstName).to.equal(user.firstName)
            expect(rdoc.lastName).to.equal(user.lastName)
            expect(rdoc.email).to.equal(user.email)

            done()
          })
        })
      })
    })

    it('should query index values for array in a compound index', function (done) {
      var userSchema = new lounge.Schema({
        firstName: String,
        lastName: String,
        email: String,
        usernames: [String]
      })

      userSchema.index(['email', 'usernames'])

      var User = lounge.model('User', userSchema)

      var user = new User({
        firstName: 'Joe',
        lastName: 'Smith',
        usernames: ['user1', 'user2']
      })

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmailAndUsername(user.email, user.usernames[0], function (err, rdoc, missing) {
          expect(err).to.not.be.ok
          expect(missing).to.eql([])

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)

          var actual = rdoc.usernames.sort()
          var expected = user.usernames.sort()

          expect(actual).to.eql(expected)
          expect(rdoc.firstName).to.equal(user.firstName)
          expect(rdoc.lastName).to.equal(user.lastName)
          expect(rdoc.email).to.equal(user.email)

          User.findByEmailAndUsername(user.email, user.usernames[1], function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an('object')
            expect(rdoc).to.be.an.instanceof(User)

            var actual = rdoc.usernames.sort()
            var expected = user.usernames.sort()

            expect(actual).to.eql(expected)
            expect(rdoc.firstName).to.equal(user.firstName)
            expect(rdoc.lastName).to.equal(user.lastName)
            expect(rdoc.email).to.equal(user.email)

            done()
          })
        })
      })
    })

    it('should query index values for array and return undefined missing when config is set', function (done) {
      lounge.setOption('missing', false)
      var userSchema = new lounge.Schema({
        firstName: String,
        lastName: String,
        usernames: [{ type: String, index: true, indexName: 'username' }]
      })

      var User = lounge.model('User', userSchema)

      var user = new User({
        firstName: 'Joe',
        lastName: 'Smith',
        usernames: ['user1', 'user2']
      })

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByUsername(user.usernames[0], function (err, rdoc, missing) {
          expect(err).to.not.be.ok
          expect(missing).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)

          var actual = rdoc.usernames.sort()
          var expected = user.usernames.sort()

          expect(actual).to.eql(expected)
          expect(rdoc.firstName).to.equal(user.firstName)
          expect(rdoc.lastName).to.equal(user.lastName)
          expect(rdoc.email).to.equal(user.email)

          User.findByUsername(user.usernames[1], function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an('object')
            expect(rdoc).to.be.an.instanceof(User)

            var actual = rdoc.usernames.sort()
            var expected = user.usernames.sort()

            expect(actual).to.eql(expected)
            expect(rdoc.firstName).to.equal(user.firstName)
            expect(rdoc.lastName).to.equal(user.lastName)
            expect(rdoc.email).to.equal(user.email)

            // reset
            lounge.setOption('missing', true)
            done()
          })
        })
      })
    })

    it('should query index values for array and return undefined missing when option is set to false', function (done) {
      var userSchema = new lounge.Schema({
        firstName: String,
        lastName: String,
        usernames: [{ type: String, index: true, indexName: 'username' }]
      })

      var User = lounge.model('User', userSchema)

      var user = new User({
        firstName: 'Joe',
        lastName: 'Smith',
        usernames: ['user1', 'user2']
      })

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByUsername(user.usernames[0], { missing: false }, function (err, rdoc, missing) {
          expect(err).to.not.be.ok
          expect(missing).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)

          var actual = rdoc.usernames.sort()
          var expected = user.usernames.sort()

          expect(actual).to.eql(expected)
          expect(rdoc.firstName).to.equal(user.firstName)
          expect(rdoc.lastName).to.equal(user.lastName)
          expect(rdoc.email).to.equal(user.email)

          User.findByUsername(user.usernames[1], function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an('object')
            expect(rdoc).to.be.an.instanceof(User)

            var actual = rdoc.usernames.sort()
            var expected = user.usernames.sort()

            expect(actual).to.eql(expected)
            expect(rdoc.firstName).to.equal(user.firstName)
            expect(rdoc.lastName).to.equal(user.lastName)
            expect(rdoc.email).to.equal(user.email)

            done()
          })
        })
      })
    })

    it('should query index values for array and return missing when option is set to true and global to false', function (done) {
      lounge.setOption('missing', false)
      var userSchema = new lounge.Schema({
        firstName: String,
        lastName: String,
        usernames: [{ type: String, index: true, indexName: 'username' }]
      })

      var User = lounge.model('User', userSchema)

      var user = new User({
        firstName: 'Joe',
        lastName: 'Smith',
        usernames: ['user1', 'user2']
      })

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByUsername(user.usernames[0], { missing: true }, function (err, rdoc, missing) {
          expect(err).to.not.be.ok
          expect(missing).to.eql([])

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(User)

          var actual = rdoc.usernames.sort()
          var expected = user.usernames.sort()

          expect(actual).to.eql(expected)
          expect(rdoc.firstName).to.equal(user.firstName)
          expect(rdoc.lastName).to.equal(user.lastName)
          expect(rdoc.email).to.equal(user.email)

          User.findByUsername(user.usernames[1], function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an('object')
            expect(rdoc).to.be.an.instanceof(User)

            var actual = rdoc.usernames.sort()
            var expected = user.usernames.sort()

            expect(actual).to.eql(expected)
            expect(rdoc.firstName).to.equal(user.firstName)
            expect(rdoc.lastName).to.equal(user.lastName)
            expect(rdoc.email).to.equal(user.email)

            // reset
            lounge.setOption('missing', true)
            done()
          })
        })
      })
    })
  })

  describe('single embedded index query tests without populate', function () {
    var User, Company
    var ts = require('./helpers/pop_setup3')

    before(function (done) {
      if (lounge) {
        lounge.disconnect()
      }

      lounge = new lounge.Lounge() // recreate it

      var cluster = testUtil.getCluser()
      bucket = cluster.openBucket('lounge_test', function (err) {
        if (err) {
          return done(err)
        }

        lounge.connect({
          bucket: bucket
        }, function () {
          bucket.manager().flush(function (err) {
            if (err) {
              return done(err)
            }

            var companySchema = lounge.schema({
              id: { type: String, key: true, generate: true, prefix: 'company::' },
              name: String,
              streetAddress: String,
              city: String,
              country: String,
              state: String,
              postalCode: String
            })

            Company = lounge.model('Company', companySchema)

            var userSchema = lounge.schema({
              firstName: String,
              lastName: String,
              email: { type: String, key: true, generate: false },
              company: { type: Company, index: true }
            })

            User = lounge.model('User', userSchema)

            var setupData = ts.getData()
            var companyData = setupData.companies
            var userData = [setupData.users[5], setupData.users[6], setupData.users[7], setupData.users[8]]

            async.each(companyData, function (cd, eaCb) {
              var cc = new Company(cd)
              cc.save(eaCb)
            }, function (err) {
              if (err) {
                return done(err)
              }

              async.each(userData, function (ud, eaCb) {
                var cu = new User(ud)
                cu.save(eaCb)
              }, done)
            })
          })
        })
      })
    })

    it('should query using simple reference document', function (done) {
      var setupData = ts.getData()
      var userData = setupData.users[6]

      User.findByCompany(userData.company, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an('object')
        expect(rdoc).to.be.an.instanceof(User)

        expect(rdoc.id).to.not.be.ok
        expect(rdoc.firstName).to.equal(userData.firstName)
        expect(rdoc.lastName).to.equal(userData.lastName)
        expect(rdoc.email).to.equal(userData.email)

        done()
      })
    })

    it('should query using simple reference document and lean option', function (done) {
      var setupData = ts.getData()
      var userData = setupData.users[6]

      User.findByCompany(userData.company, { lean: true }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.a('string')
        expect(rdoc).to.equal(userData.email)

        done()
      })
    })

    it('should query using simple reference document 2', function (done) {
      var setupData = ts.getData()
      var userData = setupData.users[7]

      User.findByCompany(userData.company, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an('object')
        expect(rdoc).to.be.an.instanceof(User)

        expect(rdoc.id).to.not.be.ok
        expect(rdoc.firstName).to.equal(userData.firstName)
        expect(rdoc.lastName).to.equal(userData.lastName)
        expect(rdoc.email).to.equal(userData.email)

        done()
      })
    })
  })

  describe('array index query tests without populate', function () {
    beforeEach(function (done) {
      if (lounge) {
        lounge.disconnect()
      }

      lounge = new lounge.Lounge() // recreate it

      var cluster = testUtil.getCluser()
      bucket = cluster.openBucket('lounge_test', function (err) {
        if (err) {
          return done(err)
        }

        lounge.connect({
          bucket: bucket
        }, function () {
          bucket.manager().flush(done)
        })
      })
    })

    it('should query using simple array reference document', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true, indexType: 'array' }
      })

      var User = lounge.model('User', userSchema)

      var userData = [{
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'joe@gmail.com'
      }, {
        firstName: 'Joe',
        lastName: 'Smith 2',
        email: 'joe@gmail.com' // same email
      }]

      var user = new User(userData[0])
      var user2 = new User(userData[1])

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        user2.save({ waitForIndex: true }, function (err, savedDoc) {
          expect(err).to.not.be.ok
          expect(savedDoc).to.be.ok

          User.findByEmail(user.email, function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an.instanceof(Array)
            expect(rdoc.length).to.equal(2)

            rdoc = _.sortBy(rdoc, 'firstName')

            expect(rdoc[0]).to.be.an.instanceof(User)
            expect(rdoc[0].id).to.be.ok
            expect(rdoc[0].id).to.be.a('string')
            expect(rdoc[0].id).to.equal(user.id)
            expect(rdoc[0].firstName).to.equal(userData[0].firstName)
            expect(rdoc[0].lastName).to.equal(userData[0].lastName)
            expect(rdoc[0].email).to.equal(userData[0].email)

            expect(rdoc[1]).to.be.an.instanceof(User)
            expect(rdoc[1].id).to.be.ok
            expect(rdoc[1].id).to.be.a('string')
            expect(rdoc[1].id).to.equal(user2.id)
            expect(rdoc[1].firstName).to.equal(userData[1].firstName)
            expect(rdoc[1].lastName).to.equal(userData[1].lastName)
            expect(rdoc[1].email).to.equal(userData[1].email)

            done()
          })
        })
      })
    })

    it('should query using simple array reference document and get empty array for unknown value', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true, indexType: 'array' }
      })

      var User = lounge.model('User', userSchema)

      var userData = [{
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'joe@gmail.com'
      }, {
        firstName: 'Joe',
        lastName: 'Smith 2',
        email: 'joe@gmail.com' // same email
      }]

      var user = new User(userData[0])
      var user2 = new User(userData[1])

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        user2.save(function (err, savedDoc) {
          expect(err).to.not.be.ok
          expect(savedDoc).to.be.ok

          User.findByEmail('unknown+123@gmail.com', function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an.instanceof(Array)
            expect(rdoc.length).to.equal(0)

            done()
          })
        })
      })
    })

    it('should query using compound index reference document and get empty array for unknown value', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: String,
        username: String
      })

      userSchema.index(['email', 'username'], { indexType: 'array' })

      var User = lounge.model('User', userSchema)

      var userData = [{
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'joe@gmail.com',
        username: 'bsmith'
      }]

      var user = new User(userData[0])

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        User.findByEmailAndUsername('unknown+123@gmail.com', 'bsmith', function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an.instanceof(Array)
          expect(rdoc.length).to.equal(0)

          done()
        })
      })
    })

    it('should query using simple reference document respecting key options - array index', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true, indexType: 'array' },
        username: { type: String, key: true, generate: false }
      })

      var User = lounge.model('User', userSchema)

      var userData = [{
        firstName: 'Joe',
        lastName: 'Jones',
        email: 'joe@gmail.com',
        username: 'jjones'
      }, {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe@gmail.com',
        username: 'jsmith'
      }]

      var user = new User(userData[0])
      var user2 = new User(userData[1])

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        user2.save(function (err, savedDoc) {
          expect(err).to.not.be.ok
          expect(savedDoc).to.be.ok

          setTimeout(() => {
            User.findByEmail(user.email, function (err, rdoc) {
              expect(err).to.not.be.ok

              expect(rdoc).to.be.ok
              expect(rdoc).to.be.an.instanceof(Array)
              expect(rdoc.length).to.equal(2)

              rdoc = _.sortBy(rdoc, 'lastName')

              expect(rdoc[0]).to.be.an.instanceof(User)
              expect(rdoc[0].id).to.not.be.ok
              expect(rdoc[0].firstName).to.equal(userData[0].firstName)
              expect(rdoc[0].lastName).to.equal(userData[0].lastName)
              expect(rdoc[0].email).to.equal(userData[0].email)

              expect(rdoc[1]).to.be.an.instanceof(User)
              expect(rdoc[1].id).to.not.be.ok
              expect(rdoc[1].firstName).to.equal(userData[1].firstName)
              expect(rdoc[1].lastName).to.equal(userData[1].lastName)
              expect(rdoc[1].email).to.equal(userData[1].email)

              done()
            })
          }, 100)
        })
      })
    })

    it('should query index values for array', function (done) {
      var userSchema = new lounge.Schema({
        firstName: String,
        lastName: String,
        usernames: [{ type: String, index: true, indexName: 'username', indexType: 'array' }]
      })

      var User = lounge.model('User', userSchema)

      var userData = [{
        firstName: 'Bob',
        lastName: 'Jones',
        usernames: ['user1', 'user2']
      }, {
        firstName: 'Joe',
        lastName: 'Smith',
        usernames: ['user2']
      }]

      var user = new User(userData[0])
      var user2 = new User(userData[1])

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        user2.save(function (err, savedDoc) {
          expect(err).to.not.be.ok
          expect(savedDoc).to.be.ok

          User.findByUsername('user1', function (err, rdoc) {
            expect(err).to.not.be.ok

            expect(rdoc).to.be.ok
            expect(rdoc).to.be.an.instanceof(Array)
            expect(rdoc.length).to.equal(1)

            var actual = rdoc[0].usernames.sort()
            var expected = user.usernames.sort()

            expect(actual).to.eql(expected)
            expect(rdoc[0].firstName).to.equal(user.firstName)
            expect(rdoc[0].lastName).to.equal(user.lastName)
            expect(rdoc[0].email).to.equal(user.email)

            User.findByUsername('user2', function (err, rdoc) {
              expect(err).to.not.be.ok

              expect(rdoc).to.be.ok
              expect(rdoc).to.be.an.instanceof(Array)
              expect(rdoc.length).to.equal(2)

              rdoc = _.sortBy(rdoc, 'firstName')

              expect(rdoc[0]).to.be.an.instanceof(User)
              expect(rdoc[0].id).to.be.ok
              expect(rdoc[0].id).to.be.a('string')
              expect(rdoc[0].id).to.equal(user.id)
              expect(rdoc[0].firstName).to.equal(userData[0].firstName)
              expect(rdoc[0].lastName).to.equal(userData[0].lastName)
              expect(rdoc[0].email).to.equal(userData[0].email)

              expect(rdoc[1]).to.be.an.instanceof(User)
              expect(rdoc[1].id).to.be.ok
              expect(rdoc[1].id).to.be.a('string')
              expect(rdoc[1].id).to.equal(user2.id)
              expect(rdoc[1].firstName).to.equal(userData[1].firstName)
              expect(rdoc[1].lastName).to.equal(userData[1].lastName)
              expect(rdoc[1].email).to.equal(userData[1].email)

              done()
            })
          })
        })
      })
    })
  })

  describe('index query with populate', function () {
    var User, Company
    var ts = require('./helpers/pop_setup2')
    var tsData = ts.getData()

    before(function (done) {
      if (lounge) {
        lounge.disconnect()
      }

      lounge = new lounge.Lounge() // recreate it

      var cluster = testUtil.getCluser()
      bucket = cluster.openBucket('lounge_test', function (err) {
        if (err) {
          return done(err)
        }

        lounge.connect({
          bucket: bucket
        }, function () {
          bucket.manager().flush(function (err) {
            if (err) {
              return done(err)
            }

            var companySchema = lounge.schema({
              id: { type: String, key: true, generate: true, prefix: 'company::' },
              name: String,
              streetAddress: String,
              city: String,
              country: String,
              state: String,
              postalCode: String
            })

            Company = lounge.model('Company', companySchema)

            var userSchema = lounge.schema({
              firstName: String,
              lastName: String,
              email: { type: String, index: true },
              company: Company
            })

            User = lounge.model('User', userSchema)

            var popData = ts.getData()

            async.each(popData.companies, function (c, eacb) {
              var company = new Company(c)
              company.save(eacb)
            }, function (err) {
              if (err) {
                return done(err)
              }

              async.each(popData.users, function (u, eacb) {
                var user = new User(u)
                user.save(eacb)
              }, done)
            })
          })
        })
      })
    })

    it('should query using simple reference document and not populate anything if option not present', function (done) {
      var email = tsData.users[0].email
      User.findByEmail(email, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an('object')
        expect(rdoc).to.be.an.instanceof(User)
        expect(rdoc.id).to.be.ok
        expect(rdoc.id).to.be.a('string')

        var userData = tsData.users[0]
        expect(rdoc.firstName).to.equal(userData.firstName)
        expect(rdoc.lastName).to.equal(userData.lastName)
        expect(rdoc.email).to.equal(userData.email)
        expect(rdoc.company).to.equal(userData.company)

        done()
      })
    })

    it('should query using simple reference document and populate as boolean', function (done) {
      var email = tsData.users[0].email
      User.findByEmail(email, { populate: true }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an('object')
        expect(rdoc).to.be.an.instanceof(User)
        expect(rdoc.id).to.be.ok
        expect(rdoc.id).to.be.a('string')

        var userData = tsData.users[0]
        var companyData = tsData.companies[0]

        expect(rdoc.firstName).to.equal(userData.firstName)
        expect(rdoc.lastName).to.equal(userData.lastName)
        expect(rdoc.email).to.equal(userData.email)

        expect(rdoc.company.id).to.equal(companyData.id)
        expect(rdoc.company.name).to.equal(companyData.name)
        expect(rdoc.company.streetAddress).to.equal(companyData.streetAddress)
        expect(rdoc.company.city).to.equal(companyData.city)
        expect(rdoc.company.country).to.equal(companyData.country)
        expect(rdoc.company.state).to.equal(companyData.state)
        expect(rdoc.company.postalCode).to.equal(companyData.postalCode)

        done()
      })
    })

    it('should query using simple reference document and populate as string', function (done) {
      var email = tsData.users[1].email
      User.findByEmail(email, { populate: 'company' }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an('object')
        expect(rdoc).to.be.an.instanceof(User)
        expect(rdoc.id).to.be.ok
        expect(rdoc.id).to.be.a('string')

        var userData = tsData.users[1]
        var companyData = tsData.companies[1]

        expect(rdoc.firstName).to.equal(userData.firstName)
        expect(rdoc.lastName).to.equal(userData.lastName)
        expect(rdoc.email).to.equal(userData.email)

        expect(rdoc.company.id).to.equal(companyData.id)
        expect(rdoc.company.name).to.equal(companyData.name)
        expect(rdoc.company.streetAddress).to.equal(companyData.streetAddress)
        expect(rdoc.company.city).to.equal(companyData.city)
        expect(rdoc.company.country).to.equal(companyData.country)
        expect(rdoc.company.state).to.equal(companyData.state)
        expect(rdoc.company.postalCode).to.equal(companyData.postalCode)

        done()
      })
    })
  })

  describe('array index query with populate', function () {
    var User, Company, userData, companyData
    var ts = require('./helpers/pop_setup3')

    before(function (done) {
      if (lounge) {
        lounge.disconnect()
      }

      lounge = new lounge.Lounge() // recreate it

      var cluster = testUtil.getCluser()
      bucket = cluster.openBucket('lounge_test', function (err) {
        if (err) {
          return done(err)
        }

        lounge.connect({
          bucket: bucket
        }, function () {
          bucket.manager().flush(function (err) {
            if (err) {
              return done(err)
            }

            var companySchema = lounge.schema({
              id: { type: String, key: true, generate: true, prefix: 'company::' },
              name: String,
              streetAddress: String,
              city: String,
              country: String,
              state: String,
              postalCode: String
            })

            Company = lounge.model('Company', companySchema)

            var userSchema = lounge.schema({
              firstName: String,
              lastName: String,
              email: { type: String, index: true, indexType: 'array' },
              company: { type: Company }
            })

            User = lounge.model('User', userSchema)

            var setupData = ts.getData()
            companyData = setupData.companies
            userData = setupData.users

            // modify user data
            userData[2].email = 'ncoleman4@europa.eu'
            userData[3].email = 'ncoleman4@europa.eu'

            userData[5].email = 'joliver2@imgur.com'
            userData[6].email = 'joliver2@imgur.com'
            userData[7].email = 'joliver2@imgur.com'
            userData[8].email = 'joliver2@imgur.com'

            async.each(companyData, function (cd, eaCb) {
              var cc = new Company(cd)
              cc.save(eaCb)
            }, function (err) {
              if (err) {
                return done(err)
              }

              var i = 0
              async.eachSeries(userData, function (ud, eaCb) {
                var cu = new User(ud)
                userData[i].id = cu.id // populate id into the data so we can access later
                i++
                cu.save({ waitForIndex: true }, eaCb)
              }, done)
            })
          })
        })
      })
    })

    it('should get a single user and not populate company if not specified', function (done) {
      User.findByEmail(userData[0].email, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(1)
        expect(rdoc[0]).to.be.an.instanceof(User)
        expect(rdoc[0].id).to.be.ok
        expect(rdoc[0].id).to.be.a('string')

        expect(rdoc[0].id).to.equal(userData[0].id)
        expect(rdoc[0].firstName).to.equal(userData[0].firstName)
        expect(rdoc[0].lastName).to.equal(userData[0].lastName)
        expect(rdoc[0].email).to.equal(userData[0].email)
        expect(rdoc[0].company).to.eql(userData[0].company)

        done()
      })
    })

    it('should get a single user and populate company if specified specifically', function (done) {
      User.findByEmail(userData[0].email, { populate: 'company' }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(1)
        expect(rdoc[0]).to.be.an.instanceof(User)
        expect(rdoc[0].id).to.be.ok
        expect(rdoc[0].id).to.be.a('string')

        expect(rdoc[0].id).to.equal(userData[0].id)
        expect(rdoc[0].firstName).to.equal(userData[0].firstName)
        expect(rdoc[0].lastName).to.equal(userData[0].lastName)
        expect(rdoc[0].email).to.equal(userData[0].email)

        expect(rdoc[0].company).to.be.ok
        expect(rdoc[0].company).to.be.an.instanceof(Company)
        expect(rdoc[0].company.id).to.equal(companyData[0].id)
        expect(rdoc[0].company.name).to.equal(companyData[0].name)
        expect(rdoc[0].company.streetAddress).to.equal(companyData[0].streetAddress)
        expect(rdoc[0].company.city).to.equal(companyData[0].city)
        expect(rdoc[0].company.country).to.equal(companyData[0].country)
        expect(rdoc[0].company.state).to.equal(companyData[0].state)
        expect(rdoc[0].company.postalCode).to.equal(companyData[0].postalCode)

        done()
      })
    })

    it('should get multiple user with same company populated when specified as boolean', function (done) {
      User.findByEmail(userData[2].email, { populate: true }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(2)

        rdoc = _.sortBy(rdoc, 'firstName')

        expect(rdoc[0]).to.be.an.instanceof(User)
        expect(rdoc[0].id).to.be.ok
        expect(rdoc[0].id).to.be.a('string')

        expect(rdoc[0].id).to.equal(userData[2].id)
        expect(rdoc[0].firstName).to.equal(userData[2].firstName)
        expect(rdoc[0].lastName).to.equal(userData[2].lastName)
        expect(rdoc[0].email).to.equal(userData[2].email)

        expect(rdoc[0].company).to.be.ok
        expect(rdoc[0].company).to.be.an.instanceof(Company)
        expect(rdoc[0].company.id).to.equal(companyData[2].id)
        expect(rdoc[0].company.name).to.equal(companyData[2].name)
        expect(rdoc[0].company.streetAddress).to.equal(companyData[2].streetAddress)
        expect(rdoc[0].company.city).to.equal(companyData[2].city)
        expect(rdoc[0].company.country).to.equal(companyData[2].country)
        expect(rdoc[0].company.state).to.equal(companyData[2].state)
        expect(rdoc[0].company.postalCode).to.equal(companyData[2].postalCode)

        expect(rdoc[1]).to.be.an.instanceof(User)
        expect(rdoc[1].id).to.be.ok
        expect(rdoc[1].id).to.be.a('string')

        expect(rdoc[1].id).to.equal(userData[3].id)
        expect(rdoc[1].firstName).to.equal(userData[3].firstName)
        expect(rdoc[1].lastName).to.equal(userData[3].lastName)
        expect(rdoc[1].email).to.equal(userData[3].email)

        expect(rdoc[1].company).to.be.ok
        expect(rdoc[1].company).to.be.an.instanceof(Company)
        expect(rdoc[1].company.id).to.equal(companyData[2].id)
        expect(rdoc[1].company.name).to.equal(companyData[2].name)
        expect(rdoc[1].company.streetAddress).to.equal(companyData[2].streetAddress)
        expect(rdoc[1].company.city).to.equal(companyData[2].city)
        expect(rdoc[1].company.country).to.equal(companyData[2].country)
        expect(rdoc[1].company.state).to.equal(companyData[2].state)
        expect(rdoc[1].company.postalCode).to.equal(companyData[2].postalCode)

        done()
      })
    })

    it('should get multiple users with different companies populated when specified as array', function (done) {
      var expectedUsers = _.sortBy([userData[5], userData[6], userData[7], userData[8]], 'firstName')
      var expectedCompanies = [companyData[4], companyData[3], companyData[1], undefined] // sorted by associated user

      User.findByEmail(userData[5].email, { populate: ['company'] }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(4)

        rdoc = _.sortBy(rdoc, 'firstName')

        rdoc.forEach(function (doc, i) {
          var user = expectedUsers[i]
          var company = expectedCompanies[i]

          expect(doc).to.be.an.instanceof(User)
          expect(doc.id).to.equal(user.id)
          expect(doc.firstName).to.equal(user.firstName)
          expect(doc.lastName).to.equal(user.lastName)
          expect(doc.email).to.equal(user.email)

          if (company) {
            expect(doc.company.toObject()).to.eql(company)
          } else {
            expect(doc.company).to.not.be.ok
          }
        })

        done()
      })
    })

    it('should get multiple users with same email with lean option', function (done) {
      User.findByEmail(userData[2].email, { lean: true }, function (err, rdoc) {
        expect(err).to.not.be.ok
        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(2)

        var expected = [userData[2].id, userData[3].id].sort()
        expect(rdoc.sort()).to.eql(expected)
        done()
      })
    })
  })

  describe('embedded array index query with populate', function () {
    var User, Company, userData, companyData
    var ts = require('./helpers/pop_setup3')

    before(function (done) {
      if (lounge) {
        lounge.disconnect()
      }

      lounge = new lounge.Lounge() // recreate it

      var cluster = testUtil.getCluser()
      bucket = cluster.openBucket('lounge_test', function (err) {
        if (err) {
          return done(err)
        }

        lounge.connect({
          bucket: bucket
        }, function () {
          bucket.manager().flush(function (err) {
            if (err) {
              return done(err)
            }

            var companySchema = lounge.schema({
              id: { type: String, key: true, generate: true, prefix: 'company::' },
              name: String,
              streetAddress: String,
              city: String,
              country: String,
              state: String,
              postalCode: String
            })

            Company = lounge.model('Company', companySchema)

            var userSchema = lounge.schema({
              firstName: String,
              lastName: String,
              email: { type: String, key: true, generate: false },
              company: { type: Company, index: true, indexType: 'array' }
            })

            User = lounge.model('User', userSchema)

            var setupData = ts.getData()
            companyData = setupData.companies
            userData = setupData.users

            async.each(companyData, function (cd, eaCb) {
              var cc = new Company(cd)
              cc.save(eaCb)
            }, function (err) {
              if (err) {
                return done(err)
              }

              async.eachSeries(userData, function (ud, eaCb) {
                var cu = new User(ud)
                cu.save({ waitForIndex: true }, eaCb)
              }, done)
            })
          })
        })
      })
    })

    it('should get users and not populate anything if populate option not specified', function (done) {
      var data = ts.getData()
      var expectedUsers = [data.users[0], data.users[1]]
      User.findByCompany(data.users[0].company, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(2)

        rdoc = _.sortBy(rdoc, 'firstName')

        var actual = _.map(rdoc, function (r) { return r.toObject() })

        expect(actual).to.eql(expectedUsers)
        done()
      })
    })

    it('should get users and populate when boolean option specified', function (done) {
      var data = ts.getData()
      var company = data.users[0].company
      var expectedUsers = [data.users[0], data.users[1]]
      var expectedCompanies = [data.companies[0], data.companies[0]]

      expectedUsers.forEach(function (u, i) {
        u.company = expectedCompanies[i]
      })

      User.findByCompany(company, { populate: true }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(2)

        rdoc = _.sortBy(rdoc, 'firstName')
        var actual = _.map(rdoc, function (r) { return r.toObject() })
        expect(actual).to.eql(expectedUsers)
        done()
      })
    })

    it('should get users and populate when string option specified', function (done) {
      var data = ts.getData()
      var company = data.users[2].company
      var expectedUsers = _.sortBy([data.users[2], data.users[3], data.users[4]], 'firstName')
      var expectedCompanies = [data.companies[2], data.companies[2], data.companies[2]]

      expectedUsers.forEach(function (u, i) {
        u.company = expectedCompanies[i]
      })

      User.findByCompany(company, { populate: 'company' }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(3)

        rdoc = _.sortBy(rdoc, 'firstName')
        var actual = _.map(rdoc, function (r) { return r.toObject() })
        expect(actual).to.eql(expectedUsers)
        done()
      })
    })

    it('should get a single user and populate when array option specified', function (done) {
      var data = ts.getData()
      var company = data.users[6].company
      var expectedUsers = [data.users[6]]
      var expectedCompanies = [data.companies[1]]

      expectedUsers.forEach(function (u, i) {
        u.company = expectedCompanies[i]
      })

      User.findByCompany(company, { populate: 'company' }, function (err, rdoc) {
        expect(err).to.not.be.ok

        expect(rdoc).to.be.ok
        expect(rdoc).to.be.an.instanceof(Array)
        expect(rdoc.length).to.equal(1)

        rdoc = _.sortBy(rdoc, 'firstName')
        var actual = _.map(rdoc, function (r) { return r.toObject() })
        expect(actual).to.eql(expectedUsers)
        done()
      })
    })
  })

  describe('log warning when target document is not found', function () {
    // set debug flag
    beforeEach(function (done) {
      if (lounge) {
        lounge.disconnect()
      }

      lounge = new lounge.Lounge() // recreate it

      var cluster = testUtil.getCluser()
      bucket = cluster.openBucket('lounge_test', function (err) {
        if (err) {
          return done(err)
        }

        lounge.connect({
          bucket: bucket
        }, function () {
          bucket.manager().flush(done)
        })
      })
    })

    it('should log warning when target document is not found', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true }
      })

      var UserModel = lounge.model('UserLogMissingRef', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe33123@gmail.com'
      }

      var user = new UserModel(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        UserModel.findByEmail(user.email, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(UserModel)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          const k = rdoc.getDocumentKeyValue(true)
          bucket.remove(k, (err) => {
            expect(err).to.not.be.ok

            UserModel.findByEmail(user.email, function (err, rdoc) {
              expect(err).to.not.be.ok

              expect(rdoc).to.not.be.ok
              done()
            })
          })
        })
      })
    })

    it('should error when target document is not found and option set in lounge config', function (done) {
      lounge.setOption('errorOnMissingIndex', true)
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true }
      })

      var UserModel = lounge.model('UserLogMissingRef', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe33123@gmail.com'
      }

      var user = new UserModel(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        UserModel.findByEmail(user.email, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(UserModel)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          const k = rdoc.getDocumentKeyValue(true)
          bucket.remove(k, (err) => {
            expect(err).to.not.be.ok

            UserModel.findByEmail(user.email, function (err, rdoc) {
              expect(err).to.be.ok
              expect(err.reference).to.be.ok
              expect(rdoc).to.not.be.ok
              lounge.setOption('errorOnMissingIndex', false)
              done()
            })
          })
        })
      })
    })

    it('should error when target document is not found and option set in call options', function (done) {
      var userSchema = lounge.schema({
        firstName: String,
        lastName: String,
        email: { type: String, index: true }
      })

      var UserModel = lounge.model('UserLogMissingRef', userSchema)

      var userData = {
        firstName: 'Joe',
        lastName: 'Smith',
        email: 'joe33123@gmail.com'
      }

      var user = new UserModel(userData)

      user.save(function (err, savedDoc) {
        expect(err).to.not.be.ok
        expect(savedDoc).to.be.ok

        UserModel.findByEmail(user.email, function (err, rdoc) {
          expect(err).to.not.be.ok

          expect(rdoc).to.be.ok
          expect(rdoc).to.be.an('object')
          expect(rdoc).to.be.an.instanceof(UserModel)
          expect(rdoc.id).to.be.ok
          expect(rdoc.id).to.be.a('string')

          expect(rdoc.id).to.equal(user.id)
          expect(rdoc.firstName).to.equal(userData.firstName)
          expect(rdoc.lastName).to.equal(userData.lastName)
          expect(rdoc.email).to.equal(userData.email)

          const k = rdoc.getDocumentKeyValue(true)
          bucket.remove(k, (err) => {
            expect(err).to.not.be.ok

            UserModel.findByEmail(user.email, { errorOnMissingIndex: true }, function (err, rdoc) {
              expect(err).to.be.ok
              expect(err.reference).to.be.ok
              console.error(err)
              expect(rdoc).to.not.be.ok
              done()
            })
          })
        })
      })
    })
  })
})
