module.exports = {
  '*.ts': ['npm run lint:eslint', 'npm run lint:prettier'],
  '*.vue': ['npm run lint:eslint', 'npm run lint:prettier'],
  '*.css': ['npm run lint:prettier'],
  '*.md': ['npm run lint:markdownlint', 'npm run lint:prettier'],
  'package.json': ['npm run lint:prettier'],
  '!(package)*.json': ['npm run lint:prettier -- --parser json'],
}
