(()=>{var e={427:(e,s,t)=>{t(185).connect(process.env.MONGODB_URL)},294:e=>{e.exports=(e,s,t,r)=>{console.error(e),t.status(500).send(e)}},954:(e,s,t)=>{const r=t(738),o=r.diskStorage({}),i=r({storage:o,fileFilter:(e,s,t)=>{"image/jpeg"===s.mimetype||"image/png"===s.mimetype?t(null,!0):t({message:"Invalid file type."},!1)}});e.exports=i},998:(e,s,t)=>{const r=t(185),o=new r.Schema({imageUrl:String,publicId:String},{timestamps:!0}),i=r.model("Image",o);e.exports={Image:i,imageSchema:o}},3:(e,s,t)=>{const r=t(185),{imageSchema:o}=t(998),i=new r.Schema({title:String,subtitle:String,content:String,images:[o],postTags:[]},{timestamps:!0}),a=r.model("Post",i);e.exports=a},945:(e,s,t)=>{const r=t(185),o=t(270),i=t(511),a=new r.Schema({username:String,password:String},{timestamps:!0});a.plugin(o);const n=r.model("User",a);i.use(n.createStrategy()),i.serializeUser(n.serializeUser()),i.deserializeUser(n.deserializeUser()),e.exports=n},119:(e,s,t)=>{const r=t(860),o=t(511),i=new r.Router;i.get("/login",((e,s)=>{s.render("login")})),i.post("/login",o.authenticate("local",{successRedirect:"/admin/dashboard",failureRedirect:"/login"})),i.get("/logout",((e,s,t)=>{e.session.user=null,e.session.save((r=>{r&&t(r),e.session.regenerate((e=>{e&&t(e),s.redirect("/")}))}))})),i.get("/admin/dashboard",((e,s)=>{s.set("Cache-Control","no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0"),e.isAuthenticated()?s.render("dashboard"):s.redirect("/login")})),e.exports=i},762:(e,s,t)=>{const r=t(860),o=t(954),i=t(3),{Image:a}=t(998),{uploadToCloudinary:n,removeFromCloudinary:c}=t(463),u=(t(517),new r.Router);u.get("/",(async(e,s)=>{s.redirect("posts")})),u.get("/posts",(async(e,s)=>{try{const e=await i.find();s.json(e)}catch(e){s.status(400).send(e)}})),u.post("/posts",o.array("postImages",20),(async(e,s)=>{try{const t=new i(e.body),r=await t.save(),o=e.files;await Promise.all(o.map((async e=>{const s=await n(e.path,"emaJons_dev"),t=new a({publicId:s.public_id,imageUrl:s.url});await i.updateOne({_id:r._id},{$addToSet:{images:[t]}})}))),s.redirect("/posts")}catch(e){s.status(400).send(e)}})),e.exports=u},532:(e,s,t)=>{const r=t(119),o=t(762);e.exports={authRouter:r,postRouter:o}},463:(e,s,t)=>{const r=t(518);t(142).config(),r.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET}),e.exports={uploadToCloudinary:(e,s)=>r.v2.uploader.upload(e,{folder:s}).then((e=>({url:e.url,public_id:e.public_id}))).catch((e=>{console.log(e)})),removeFromCloudinary:async e=>{await r.v2.uploader.destroy(e,((e,s)=>{console.log(e,s)}))}}},518:e=>{"use strict";e.exports=require("cloudinary")},142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},508:e=>{"use strict";e.exports=require("express-session")},517:e=>{"use strict";e.exports=require("lodash")},185:e=>{"use strict";e.exports=require("mongoose")},738:e=>{"use strict";e.exports=require("multer")},511:e=>{"use strict";e.exports=require("passport")},270:e=>{"use strict";e.exports=require("passport-local-mongoose")}},s={};function t(r){var o=s[r];if(void 0!==o)return o.exports;var i=s[r]={exports:{}};return e[r](i,i.exports,t),i.exports}(()=>{const e=t(860);t(427),t(945);const{authRouter:s,postRouter:r}=t(532),o=t(511),i=t(508),a=t(294),n=e();n.use(i({secret:process.env.SECRET,resave:!1,saveUninitialized:!1})),n.use(o.initialize()),n.use(o.session()),n.use(e.json()),n.set("view engine","ejs"),n.set("views","./src/views"),n.use(e.static("public")),n.use(e.urlencoded({extended:!0})),n.use(r,s),n.use(a),n.listen(3e3)})()})();