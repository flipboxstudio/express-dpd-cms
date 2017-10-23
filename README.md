# Express-Deployd CMS

**What's This?**

This is a simple Content Management System created with Express and Deployd as the main middleware. Deployd takes care most of the basic functions while Express will handle the advanced functionalities ( if needed )

**What's Inside?**

- Express
- Deployd 1.0.0 with
	- DPD Mail for mail functionality
	- DPD Events for custom endpoints
	- DPD File Upload for ... file upload 
	- DPD ACL Roles for API role access limitation
- Socket.io for real time functionality
- MongoDB
- Simple admin panel using Nuxt & VueJS

**How to Use?**

- [Install MongoDB](https://docs.mongodb.com/manual/installation/)
- [Install Deployd v1.0.0](https://github.com/deployd/deployd)
- `npm install` on root folder & `public/admin` folders
- `dpd` on root folder **or** `dpd -H localhost -a usermongo:passmongo` or [run as node module](http://docs.deployd.com/docs/server/as-a-node-module.html) - you can use `node express-development.js` to start express server. Please remember to check the port used and change `public/admin/app.html` so that admin panel can get `dpd.js` file properly
- `npm run dev` on `public/admin` to run the admin panel
	- Environment is handled using `config` modules. Look for `public/admin/config/*.js` for admin panel environment configurations.


**FAQ**

- What's the output of this CMS? API endpoints and basic admin panel
- When should I use this CMS? If you want to create a simple and reusable website. The API can be used for frontend / mobile applications.
- What's the benefit of using this CMS? Super fast backend functionality using deployd built in features. For a simple CMS, those are more than enough. More advanced use cases can be handled using Express features.
- What's bundled inside this CMS?
	- User Module ( login, logout, CRUD using admin panel )
	- Posts Module ( CRUD using admin panel, category, simple WYSIWYG editor, file upload )
	- Pages Module ( CRUD using admin panel, simple WYIWYG editor )
	- Menus Module ( CRUD using admin panel, simple WYIWYG editor )
	- Categories Module ( CRUD using admin panel, simple WYIWYG editor )
	- and others...
- Screenshot Plz!!

First of all, this is the Deployd Dashboard : useful for data management

![Deployd](https://puu.sh/y5ahk/40b71a18cd.png)

Then, this is the admin panel created with Vuetify

![Admin](https://puu.sh/y5asj/7c54a9dda1.png)