function isValidEmail(email: string) {
  return /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/.test(email)
}

function isValidUrl(url: string) {
  const urlRegex =
    /^(https?:\/\/)((localhost)|((((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.){3}((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))))(?::\d{2,5})?(?:\/\S*)?$/
  return urlRegex.test(url)
}

export { isValidEmail, isValidUrl }
