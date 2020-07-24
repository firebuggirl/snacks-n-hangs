# Run/start MongoDB locally 7-24-2020:

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x-tarball/

- Run mongod with a configuration file

`mongod --config /usr/local/etc/mongod.conf`

`mongo`

- Verify that MongoDB has started successfully:

`ps aux | grep -v grep | grep mongod`

- Run mongod with command-line parameters

`mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork`

- shutdown => https://docs.mongodb.com/manual/reference/command/shutdown/:

`use admin`

`db.shutdownServer({timeoutSecs: 60});`

## Update to Catalina 10.15.5 Issues

- June 29th, 2020

- https://apple.stackexchange.com/questions/362883/mongodb-doesnt-work-after-update-to-macos-catalina-10-15

- try:

 `System Preferences > Security & Privacy > General` => has a section at the bottom for app developer identity settings and also reports any recent related service denials. This is where you will find the coveted `Allow Anyway` button:

  - click `allow anyway` for `mongo` => run mongod in terminal again => You'll get a new security dialog with an Open button. Click it and mongo is back in the trust circle => same !trusted error appears again => repeat previous steps click `allow anyway` for `mongod` 

## Create backups

- `mongodump`:

https://docs.mongodb.com/manual/reference/program/mongodump/

- 7-2020 => create user on `admin db` with `role root`

     `mongo`

     `use admin`

      `db.createUser({user: 'see localhost:27017 in password manager &/or .env', pwd: 'see localhost:27017 in password manager', roles: ['root']})`
      
      `db.getUsers()` to see users after already created

* Relaunch `mongod with authentication` enabled

      `db.shutdownServer()`

      `mongod --config /usr/local/etc/mongod.conf --auth`

      `mongo -u -p`


  


