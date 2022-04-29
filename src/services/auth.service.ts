import axios from 'axios'
import jsonp from 'jsonp'

import getEnvApi from '@/services/get-env-api'

function getNonce(address: string) {
  return axios.get(getEnvApi() + '/get-nonce/?address=' + address)
}

function login({ signature, email, address }) {
  return axios.post(getEnvApi() + '/login/', {
    signature,
    email,
    address,
  })
}

function addUserToMailchimp(email: string) {
  const mailchimpGroup = import.meta.env.VITE_MAILCHIMP_GROUP
  const mailchimpDevPortalId = import.meta.env.VITE_MAILCHIMP_DEV_PORTAL_ID

  const data = {
    u: import.meta.env.VITE_MAILCHIMP_USER_ID,
    id: import.meta.env.VITE_MAILCHIMP_LIST_ID,
    EMAIL: email,
    [`${mailchimpGroup}[${mailchimpDevPortalId}]`]: mailchimpDevPortalId,
  }

  const stringifiedData = new URLSearchParams(data).toString()

  const url = `${import.meta.env.VITE_MAILCHIMP_LIST_URL}?${stringifiedData}`
  jsonp(url, { param: 'c' }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

const authService = {
  getNonce,
  login,
  addUserToMailchimp,
}

export default authService
