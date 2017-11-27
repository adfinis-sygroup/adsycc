import Route from '@ember/routing/route'
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin'

export default Route.extend(UnauthenticatedRouteMixin, {
  activate() {
    document.body.classList.add('page-login')
  },
  deactivate() {
    document.body.classList.remove('page-login')
  }
})
