import jsonp from 'jsonp'

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

export { addUserToMailchimp }
