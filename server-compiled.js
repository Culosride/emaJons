(()=>{var e={427:(e,s,t)=>{t(185).connect(process.env.MONGODB_URL)},294:e=>{e.exports=(e,s,t,r)=>{console.error(e),t.status(500).send(e)}},954:(e,s,t)=>{const r=t(738),a=r.diskStorage({}),o=r({storage:a,fileFilter:(e,s,t)=>{"image/jpeg"===s.mimetype||"image/png"===s.mimetype?t(null,!0):t({message:"Invalid file type."},!1)}});e.exports=o},256:(e,s,t)=>{const r=t(185),a=new r.Schema({name:String,allTags:[String]},{timestamps:!0}),o=r.model("Category",a);e.exports=o},998:(e,s,t)=>{const r=t(185),a=new r.Schema({imageUrl:String,publicId:String},{timestamps:!0}),o=r.model("Image",a);e.exports={Image:o,imageSchema:a}},3:(e,s,t)=>{const r=t(185),{imageSchema:a}=t(998),o=new r.Schema({title:String,subtitle:String,content:String,images:[a],postTags:[String],category:String},{timestamps:!0}),i=r.model("Post",o);e.exports=i},945:(e,s,t)=>{const r=t(185),a=t(270),o=t(511),i=new r.Schema({username:String,password:String},{timestamps:!0});i.plugin(a);const n=r.model("User",i);o.use(n.createStrategy()),o.serializeUser(n.serializeUser()),o.deserializeUser(n.deserializeUser()),e.exports=n},119:(e,s,t)=>{const r=t(860),a=t(511),o=new r.Router;o.get("/login",((e,s)=>{s.render("login")})),o.post("/login",a.authenticate("local",{successRedirect:"/admin/dashboard",failureRedirect:"/login"})),o.get("/logout",((e,s,t)=>{e.session.user=null,e.session.save((r=>{r&&t(r),e.session.regenerate((e=>{e&&t(e),s.redirect("/")}))}))})),o.get("/admin/dashboard",((e,s)=>{s.set("Cache-Control","no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0"),e.isAuthenticated()?s.render("dashboard"):s.redirect("/login")})),e.exports=o},437:(e,s,t)=>{const r=t(860),a=t(256),o=new r.Router,i=t(517);o.get("/api/categories/:category",(async(e,s)=>{try{const t=await a.find({name:i.capitalize(e.params.category)});s.json(t)}catch(e){s.status(400).send(e)}})),e.exports=o},762:(e,s,t)=>{const r=t(860),a=t(954),o=t(3),{Image:i}=t(998),{uploadToCloudinary:n,removeFromCloudinary:c}=t(463),u=t(517),p=new r.Router,d=(t(738),a.array("images",20));p.get("/",(async(e,s)=>{s.redirect("/admin/dashboard")})),p.get("/posts",(async(e,s)=>{try{const e=await o.find();s.status(200).json(e)}catch(e){s.status(404).send(e)}})),p.get("/api/posts/:category",(async(e,s)=>{try{const t=await o.find({category:u.capitalize(e.params.category)});s.status(200).json(t)}catch(e){s.status(404).send(e)}})),p.get("/api/posts/:category/:postId",(async(e,s)=>{try{const t=await o.findById(e.params.postId);s.status(200).json(t)}catch(e){s.status(400).send(e)}})),p.post("/posts",d,(async(e,s)=>{try{const t=new o(e.body),r=await t.save(),a=e.files;await Promise.all(a.map((async e=>{const s=await n(e.path,"emaJons_dev"),t=new i({publicId:s.public_id,imageUrl:s.url});await o.updateOne({_id:r._id},{$addToSet:{images:[t]}})}))),s.status(200).json({lastId:t._id})}catch(e){s.status(400).send(e)}})),e.exports=p},532:(e,s,t)=>{const r=t(119),a=t(762),o=t(437);e.exports={authRouter:r,postRouter:a,categoryRouter:o}},463:(e,s,t)=>{const r=t(518);t(142).config(),r.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET}),e.exports={uploadToCloudinary:(e,s)=>r.v2.uploader.upload(e,{folder:s}).then((e=>({url:e.url,public_id:e.public_id}))).catch((e=>{console.log(e)})),removeFromCloudinary:async e=>{await r.v2.uploader.destroy(e,((e,s)=>{console.log(e,s)}))}}},518:e=>{"use strict";e.exports=require("cloudinary")},582:e=>{"use strict";e.exports=require("cors")},142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},508:e=>{"use strict";e.exports=require("express-session")},517:e=>{"use strict";e.exports=require("lodash")},185:e=>{"use strict";e.exports=require("mongoose")},738:e=>{"use strict";e.exports=require("multer")},511:e=>{"use strict";e.exports=require("passport")},270:e=>{"use strict";e.exports=require("passport-local-mongoose")},17:e=>{"use strict";e.exports=require("path")}},s={};function t(r){var a=s[r];if(void 0!==a)return a.exports;var o=s[r]={exports:{}};return e[r](o,o.exports,t),o.exports}(()=>{const e=t(860);t(427),t(945);const{authRouter:s,postRouter:r,categoryRouter:a}=t(532),o=t(511),i=t(508),n=t(294),c=t(17),u=t(582),p=e();p.use(u()),p.use(i({secret:process.env.SECRET,resave:!1,saveUninitialized:!1})),p.use(o.initialize()),p.use(o.session()),p.use(e.json()),p.set("view engine","ejs"),p.set("views","./src/views"),p.use(e.static("public")),p.use(e.urlencoded({extended:!0})),p.use(r,s,a),p.use(n),p.use("/assets",e.static(c.join(__dirname,"../public"))),p.get("/*",((e,s)=>{try{s.render("home")}catch(e){s.status(400).send(e)}})),p.listen(3e3)})()})();