function isValidEmail(email: string) {
  return /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/.test(email)
}

export { isValidEmail }
