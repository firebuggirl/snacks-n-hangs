# Find parent of child package

`nvm use 13`

`nvm ls`

`npm outdated`

`npm ls <package>`

`npm ls minimist`

`npm i babel-loader@6.4.1 --save-dev`

`npm audit`

`npm audit fix`

`npm i sass-loader@6.0.7 --save-dev`

`npm i postcss-loader@1.3.3 --save-dev`

`npm i webpack@4.0.0 --save-dev`

`npm install -g npm-check-updates`

## npm-check-updates

https://www.npmjs.com/package/npm-check-updates

`npm i npm-check-updates`

`ncu`

`ncu -u`

`npm i`

- Express Validator Error: expressValidator is not a function

`npm i express-validator@5.3.1 --save`//issue resolved for now

`npm i promisify-node --save`

`npm uninstall es6-promisify --save`

## Bcrypt => Gravatar issue

```yaml
(node:17061) UnhandledPromiseRejectionWarning: Error: Illegal arguments: string, undefined

..... at model.get [as gravatar]
```

- in `models/User.js` comment out for now..come back later:

```js
userSchema.virtual('gravatar').get(function() {
  //const hash = md5(this.email);//md5 is the algorithm used by gravatar to hash user's email address
  const hash = bcrypt.hash(this.email)
  return `https://gravatar.com/avatar/${hash}?s=200`;//S = size
});
```
