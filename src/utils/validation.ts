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
  return /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/.test(email)
}

function isValidUrl(url: string) {
  return URLRegex.test(url)
}

export { isValidEmail, isValidUrl }
