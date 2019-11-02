# Fix Brew Services Mongo Error:

- Error: mongodb: unknown version :mountain_lion

https://superuser.com/questions/1478156/error-mongodb-unknown-version-mountain-lion/1478299


` brew services stop mongodb

  brew uninstall mongodb

  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community `


## Run/start:

  ` brew services start mongodb-community `

  https://github.com/mongodb/homebrew-brew
