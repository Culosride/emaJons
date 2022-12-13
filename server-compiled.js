(()=>{var e={427:(e,s,t)=>{t(185).connect(process.env.MONGODB_URL)},294:e=>{e.exports=(e,s,t,a)=>{console.error(e),t.status(500).send(e)}},954:(e,s,t)=>{const a=t(738),r=a.diskStorage({}),o=a({storage:r,fileFilter:(e,s,t)=>{"image/jpeg"===s.mimetype||"image/png"===s.mimetype?t(null,!0):t({message:"Invalid file type."},!1)}});e.exports=o},197:(e,s,t)=>{const a=t(256);t(517),e.exports=async function(e,s,t){const{newTag:r}=e.body;(await a.findOne({})).allTags.some((e=>e===r))?s.status(400).send({message:"Tag already exists"}):t()}},256:(e,s,t)=>{const a=t(185),r=new a.Schema({name:{type:String,required:!0,unique:!0},allTags:[String]},{timestamps:!0}),o=a.model("Category",r);e.exports=o},998:(e,s,t)=>{const a=t(185),r=new a.Schema({imageUrl:String,publicId:String},{timestamps:!0}),o=a.model("Image",r);e.exports={Image:o,imageSchema:r}},3:(e,s,t)=>{const a=t(185),{imageSchema:r}=t(998),o=new a.Schema({title:String,subtitle:String,content:String,images:[r],postTags:[String],category:String},{timestamps:!0}),i=a.model("Post",o);e.exports=i},945:(e,s,t)=>{const a=t(185),r=t(270),o=t(511),i=new a.Schema({username:{type:String,unique:!0},password:String},{timestamps:!0});i.plugin(r);const n=a.model("User",i);o.use(n.createStrategy()),o.serializeUser(n.serializeUser()),o.deserializeUser(n.deserializeUser()),e.exports=n},119:(e,s,t)=>{const a=t(860),r=t(511),o=new a.Router;o.get("/login",((e,s)=>{s.render("login")})),o.post("/login",r.authenticate("local",{successRedirect:"/admin/dashboard",failureRedirect:"/login"})),o.get("/logout",((e,s,t)=>{e.session.user=null,e.session.save((a=>{a&&t(a),e.session.regenerate((e=>{e&&t(e),s.redirect("/")}))}))})),o.get("/admin/dashboard",((e,s)=>{s.set("Cache-Control","no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0"),e.isAuthenticated()?s.render("dashboard"):s.redirect("/login")})),e.exports=o},437:(e,s,t)=>{const a=t(860),r=t(256),o=new a.Router,i=t(517),n=t(197);o.get("/api/categories/:category",(async(e,s)=>{try{const t=await r.find({name:i.capitalize(e.params.category)});s.json(t)}catch(e){s.status(400).send(e)}})),o.get("/api/categories/",(async(e,s)=>{try{const e=await r.findOne({name:"dummy"});s.status(200).json(e.allTags)}catch(e){s.status(400).send(e)}})),o.patch("/api/categories/tags",n,(async(e,s)=>{const{newTag:t}=e.body,a=i.capitalize(t);try{await r.findOneAndUpdate({name:"dummy"},{$push:{allTags:a}}),s.status(200).json(a)}catch(e){s.status(400).send(e)}})),o.patch("/api/categories/deleteTag",(async(e,s)=>{const{tagToDelete:t}=e.body;try{await r.findOneAndUpdate({name:"dummy"},{$pull:{allTags:t}}),s.status(200).json({deletedTag:t,message:"Tag deleted"})}catch(e){s.status(400).send(e)}})),e.exports=o},762:(e,s,t)=>{const a=t(860),r=t(954),o=t(3),{Image:i}=t(998),{uploadToCloudinary:n,removeFromCloudinary:c}=t(463),u=t(517),d=new a.Router,p=(t(738),r.array("images",20));d.get("/",(async(e,s)=>{s.redirect("/admin/dashboard")})),d.get("/posts",(async(e,s)=>{try{const e=await o.find();s.status(200).json(e)}catch(e){s.status(404).send(e)}})),d.get("/api/posts/:category",(async(e,s)=>{try{const t=await o.find({category:u.capitalize(e.params.category)});s.status(200).json(t)}catch(e){s.status(404).send(e)}})),d.get("/api/posts/:category/:postId",(async(e,s)=>{try{const t=await o.findById(e.params.postId);s.status(200).json(t)}catch(e){s.status(400).send(e)}})),d.post("/posts",p,(async(e,s)=>{if(e.isAuthenticated()){const t=new o(e.body),a=await t.save(),r=e.files;await Promise.all(r.map((async e=>{const s=await n(e.path,"emaJons_dev"),t=new i({publicId:s.public_id,imageUrl:s.url});await o.updateOne({_id:a._id},{$addToSet:{images:[t]}})})));const c=await o.findById(t._id);s.status(200).json(c)}else s.redirect("/login")})),e.exports=d},532:(e,s,t)=>{const a=t(119),r=t(762),o=t(437);e.exports={authRouter:a,postRouter:r,categoryRouter:o}},463:(e,s,t)=>{const a=t(518);t(142).config(),a.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET}),e.exports={uploadToCloudinary:(e,s)=>a.v2.uploader.upload(e,{folder:s}).then((e=>({url:e.url,public_id:e.public_id}))).catch((e=>{console.log(e)})),removeFromCloudinary:async e=>{await a.v2.uploader.destroy(e,((e,s)=>{console.log(e,s)}))}}},518:e=>{"use strict";e.exports=require("cloudinary")},582:e=>{"use strict";e.exports=require("cors")},142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},508:e=>{"use strict";e.exports=require("express-session")},517:e=>{"use strict";e.exports=require("lodash")},185:e=>{"use strict";e.exports=require("mongoose")},738:e=>{"use strict";e.exports=require("multer")},511:e=>{"use strict";e.exports=require("passport")},270:e=>{"use strict";e.exports=require("passport-local-mongoose")},17:e=>{"use strict";e.exports=require("path")}},s={};function t(a){var r=s[a];if(void 0!==r)return r.exports;var o=s[a]={exports:{}};return e[a](o,o.exports,t),o.exports}(()=>{const e=t(860);t(427),t(945),t(256);const{authRouter:s,postRouter:a,categoryRouter:r}=t(532),o=t(511),i=t(508),n=t(294),c=t(17),u=t(582),d=e();d.use(u()),d.use(i({secret:process.env.SECRET,resave:!1,saveUninitialized:!1})),d.use(o.initialize()),d.use(o.session()),d.use(e.json()),d.set("view engine","ejs"),d.set("views","./src/views"),d.use(e.static("public")),d.use(e.urlencoded({extended:!0})),d.use(a,s,r),d.use(n),d.use("/assets",e.static(c.join(__dirname,"../public"))),d.get("/*",((e,s)=>{try{s.render("home")}catch(e){s.status(400).send(e)}})),d.listen(3e3)})()})();