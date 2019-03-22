// installing nodejs on server
// sudo apt-get install python-software-properties
// curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
// sudo apt-get install nodejs
// node -v 
// npm -v 


// installing mongodb on server
// Adding the MongoDB Repository
// sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
// echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
// sudo apt-get update
// sudo apt-get install -y mongodb-org
// sudo systemctl start mongod
// sudo systemctl status mongo


// setup user and db at mongo   https://www.rosehosting.com/blog/how-to-install-mongodb-on-ubuntu-16-04/
// use Airobotica
//for stg
// db.createUser({user:"Airobotica", pwd:"A!rP@ssw0rdStg", roles:[{role:"userAdmin", db:"airoboticaDB"}]})
// sudo nano /lib/systemd/system/mongod.service
// ExecStart=/usr/bin/mongod --quiet --auth --config /etc/mongod.conf
// Make sure to save (press Ctrl+O) and close (press Ctrl+X) the file.
// sudo systemctl daemon-reload
// sudo systemctl restart mongod
// mongo -u airoboticaDB -p Airobotica --authenticationDatabase admin