import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

/* eslint-disable array-callback-return, max-nested-callbacks */
Router.map(function() {
  this.route('login', function() {
    this.route('password-reset')
    this.route('new-password', { path: '/new-password/:token' })
  })

  this.route('protected', { path: '/' }, function() {
    this.route('index', { path: '/', resetNamespace: true })

    this.route('rt', { resetNamespace: true }, function() {
      this.route('issues', { path: '/' })
    })

    this.route('redmine', { resetNamespace: true }, function() {
      this.route('issues', { path: '/' })
    })

    this.route('symon', { resetNamespace: true })

    this.route('subscription', { resetNamespace: true }, function() {
      this.route('timesheet', { path: '/timesheet/:id' }, function() {
        this.route('index', { path: '/' })
      })

      this.route('abo', { path: '/abo/:project_id/:abotype_id' })
    })

    this.route('user', { resetNamespace: true }, function() {
      this.route('profile')
    })

    this.route('vault', { resetNamespace: true }, function() {
      this.route('edit', { path: '/*path' })
    })
  })

  this.route('notfound', { path: '/*path' })

  this.route('subscription', function() {
    this.route('admin', function() {})
  })
})

export default Router
