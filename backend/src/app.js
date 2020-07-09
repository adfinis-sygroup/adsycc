import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import passport from 'passport'
import redis from 'redis'
import jwt from 'jwt-redis-session'
import debug from 'debug'
import login from './login'
import passwordreset from './password-reset'
import services from './services'
import userRoute from './user/route'
import vaultTokenRenewer from './vault/vault-token'
import { timedTokenRenew } from './timed/token'
import { rtTokenRenew } from './rt/token'
import config from './config'
import nodemailer from 'nodemailer'
import * as Sentry from '@sentry/node'
import { Issuer } from 'openid-client'
import expressSession from 'express-session'


const app = express()
export default app

app.use(Sentry.Handlers.requestHandler())

app.log = {}
app.log.error = debug('app:error')
app.log.debug = debug('app:debug')

const env = app.get('env')

/* istanbul ignore next */
if (env === 'production') {
  app.use(morgan('combined'))
} else if (env === 'development') {
  app.use(morgan('dev'))
}

app.use(
  bodyParser.json({
    type: ['application/json', 'application/vnd.api+json']
  })
)

// eslint-disable-next-line no-magic-numbers
const sessionLifeTime = 24 * 60 * 60 // 1 day

/**
 * JWT
 */
app.use(
  jwt({
    client: redis.createClient(
      config.redis.port,
      config.redis.host,
      config.redis.options
    ),
    secret: config.login.secret,
    keyspace: 'session:',
    maxAge: sessionLifeTime,
    algorithm: 'HS256', // sha256
    requestKey: 'session',
    requestArg: 'Authorization'
  })
)

/**
 * OpenID
 */
Issuer.discover('TIMED URL').then(timedIssuer => {
  let client = new timedIssuer.Client({
    client_id: 'CONFIDENTIAL_CLIENT_ID',
    client_secret: '',
    redirect_uris: ['http://localhost:3000/auth/callback'],
    post_logout_redirect_uris: ['http://localhost:3000/logout/callback'],
    token_endpoint_auth_method: ''
  })

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })


})

app.use(passport.initialize())
app.use(passport.session())

// mail
app.set('mailTransporter', nodemailer.createTransport(config.mailTransporter))

app.use(vaultTokenRenewer())
app.use(timedTokenRenew())
app.use(rtTokenRenew())
app.use('/api/v1', login)
app.use('/api/v1', passwordreset)

app.use((req, res, next) => {
  if (req.isAuthenticated()) return next()

  req.session.destroy(() => {
    next({ status: 401, message: 'Not Authorized' })
  })
})

app.use('/api/v1', userRoute)

app.use('/api', services)

app.get('/', (req, res) => {
  res.redirect('/api/v1')
})

// Unused last parameter is needed to make this an error-handling middleware,
// see http://expressjs.com/en/guide/error-handling.html
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _) => {
  let { message: detail, status = 500 } = err
  res.status(status)

  if (status === 500) {
    app.log.error('Error 500', err)
    detail = 'Internal server error'
  }

  req.session.destroy(function() {
    res.send({
      errors: [{ status, detail }]
    })
  })
})
