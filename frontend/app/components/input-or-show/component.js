import { inject as service } from '@ember/service'
import Component from '@ember/component'

// Copy value into the clipboard
const copyToClipboard = value => {
  let textArea = document.createElement('textarea')
  textArea.value = value
  document.body.appendChild(textArea)
  textArea.select()
  let successful = document.execCommand('copy')
  document.body.removeChild(textArea)
  return successful
}

export default Component.extend({
  notify: service(),
  i18n: service(),

  tagName: '',

  multiline: false,

  actions: {
    copy() {
      if (copyToClipboard(this.get('value'))) {
        this.get('notify').success(
          this.get('i18n').t('vault.clipboard-success')
        )
      } else {
        this.get('notify').error(this.get('i18n').t('vault.clipboard-error'))
      }
    }
  }
})
