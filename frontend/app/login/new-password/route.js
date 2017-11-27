import Route from '@ember/routing/route'
import fetch from 'fetch'

/**
 * New-password route
 *
 * Displays the new password of the user
 *
 * @class LoginNewPasswordRoute
 * @public
 */
export default Route.extend({
  /**
   * Fetches the new password
   *
   * @return {Object}
   */
  async model({ token }) {
    let res = await fetch(`/api/v1/reset-password/${token}`)

    if (!res.ok) {
      this.transitionTo('login.password-reset')
      return
    }

    let { data } = await res.json()

    return data
  },

  /**
   * Render into the main template, not the login form
   *
   * @return {void}
   */
  renderTemplate() {
    this.render({
      into: 'application'
    })
  }
})
