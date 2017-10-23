### Frisian Flag Career

**Technical Stack**

- NodeJs with Deployd
- VueJs with Nuxt
- MongoDB

**How to Install**

- [Install MongoDB](https://docs.mongodb.com/manual/installation/)
- [Install Deployd v1.0.0](https://github.com/deployd/deployd)
- `npm install` on root folder & `public/*-src` folders
- `dpd` on root folder **or** `dpd -H localhost -a usermongo:passmongo` or [run as node module](http://docs.deployd.com/docs/server/as-a-node-module.html)


**Notes**

- During frontend development, please deploy `dpd` server and use static path for `dpd.js` `e.g http://localhost:2304/dpd.js`
- During deployment, change static path to relative path `/dpd.js`