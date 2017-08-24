import Ember from 'ember'

const { computed } = Ember

/**
 * The User model
 *
 * @class User
 * @public
 */
export default Ember.Object.extend({
  ajax: Ember.inject.service(),

  /**
   * User rollback
   *
   * @return {void}
   */
  rollback() {
    this.setProperties(JSON.parse(this.__rollback).data.user)
  },

  /**
   * Save the user
   *
   * @return {Promise}
   */
  async save() {
    let res = await this.get('ajax').request('/api/v1/user/current', {
      type: 'put',
      data: JSON.stringify(this),
      contentType: 'application/json'
    })

    this.setProperties(res.data.user)
    this.__rollback = JSON.stringify(res)
  },

  /**
   * Transform the user for the backend
   *
   * @return {Object}
   */
  toJSON() {
    return {
      username: this.username,
      shortname: this.shortname,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      language: this.language,
      groups: this.groups,
      emails: this.emails
    }
  },

  /**
   * Full name
   *
   * @property {string} fullName
   * @readOnly
   * @public
   */
  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`.trim()
  }),

  /**
   * Has redmine access
   *
   * @property {boolean} redmine
   * @readOnly
   * @public
   */
  redmine: computed('groups.[]', function() {
    return this._checkGroup('redmine')
  }),

  /**
   * Has monitoring access
   *
   * @property {boolean} monitoring
   * @readOnly
   * @public
   */
  monitoring: computed('groups.[]', function() {
    return this._checkGroup('mon')
  }),

  /**
   * Has sysupport access
   *
   * @property {boolean} sysupport
   * @readOnly
   * @public
   */
  sysupport: computed('groups.[]', function() {
    return this._checkGroup('sysupport')
  }),

  /**
   * List of wiki groups
   *
   * @property {string[]} wikis
   * @readOnly
   * @public
   */
  wikis: computed('groups.[]', function() {
    return this.groups
      .filter(g => g.endsWith('-wiki'))
      .map(g => g.split('-')[0])
  }),

  /**
   * Has rt access
   *
   * @property {boolean} rt
   * @readOnly
   * @public
   */
  rt: computed('email', 'emails.[]', function() {
    return this.email || this.emails.length
  }),

  /**
   * Check if the entry is in the group
   * @param  {{String}} name  the name of the service. eg redmine, mon etc
   * @return {{Boolean}}      true if found in the user groups
   */
  _checkGroup(name) {
    return this.groups.find(g => g.endsWith(`-${name}`))
  }
})
