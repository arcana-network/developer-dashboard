import { toASCII } from 'punycode'

const urlRegexPattern = {
  protocol: 'https?://',
  localhost: 'localhost',
  ipv4: /(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.){3}((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))/,
  port: /(?::\d{2,5})/,
  domain:
    /(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))/,
  path: /(?:\/\S*)/,
}

const { protocol, localhost, ipv4, port, domain, path } = urlRegexPattern
const URLRegex = new RegExp(
  `^(${protocol})((${localhost})|(${ipv4.source})|(${domain.source}))(${port.source})?(${path.source})?$`
)

function isValidEmail(email: string) {
  const splitEmails = email.split('@')
  let decodedEmail = ''
  if (splitEmails[0]) {
    decodedEmail += toASCII(splitEmails[0])
  }
  if (splitEmails[1]) {
    decodedEmail += '@' + toASCII(splitEmails[1])
  }
  console.log({ decodedEmail })
  return /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([\w]{2,24}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(
    decodedEmail
  )
}

function isValidUrl(url: string) {
  return URLRegex.test(url)
}

export { isValidEmail, isValidUrl }
