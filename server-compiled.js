(()=>{var e={919:(e,s,t)=>{const a=t(96),o=t(945),r=t(344),n=t(256),i=t(3),c=t(517),u={secure:!0,sameSite:"None",maxAge:864e5};e.exports={handleLogin:async(e,s)=>{const{username:t,password:n}=e.body;if(!t||!n)return s.status(400).json({message:"Username and password required."});const i=await o.findOne({username:t}).exec();if(!i)return s.status(401).json({message:"Unauthorized."});if(!await a.compare(n,i.password))return s.status(401).json({message:"Unauthorized."});const c=r.sign({UserInfo:{username:i.username,roles:i.roles}},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"}),d=r.sign({username:i.username},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"7d"});s.cookie("jwt",d,u),s.json({accessToken:c})},handleNewUser:async(e,s)=>{const{username:t,password:r}=e.body;if(!t||!r)return s.status(400).json({message:"Username and password required."});if(await o.findOne({username:t}).exec())return s.status(409).json({message:"Username already exists"});try{const e=await a.hash(r,10),n=new o({username:t,roles:{BasicUser:1909},password:e});await n.save(),s.status(201).json({message:`User ${t} successfully created.`})}catch(e){s.status(500).json({message:e.message})}},handleRefreshToken:async(e,s)=>{const t=e.cookies;if(!t?.jwt)return s.status(401).json({message:"Unauthorized."});const a=t.jwt;r.verify(a,process.env.REFRESH_TOKEN_SECRET,(async(e,t)=>{if(e)return s.status(403).json({message:"Forbidden."});const a=await o.findOne({username:t.username}).exec();if(!a)return s.status(401).json({message:"Unauthorized."});const n=r.sign({UserInfo:{username:a.username,roles:a.roles}},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});s.json({accessToken:n})}))},handleLogout:async(e,s)=>{if(!e.cookies?.jwt)return s.status(204).json({message:"204 No Content"});s.clearCookie("jwt",u),s.status(200).json({message:"Cookie cleared"})},validatePath:async(e,s)=>{const{category:t,postId:a}=e.params;if(!await n.findOne({name:c.capitalize(t)}))return console.log("cat does not exist"),s.status(404).json({message:"This resource doesn't exist"});if(a){if(24!==a.length&&12!==a.length)return console.log("wrong ID format"),s.status(404).json({message:"This resource doesn't exist"});if(!await i.findById(a))return console.log("post does not exist"),s.status(404).json({message:"This resource doesn't exist"})}return s.status(200).json({message:"Path is valid"})}}},427:(e,s,t)=>{t(185).connect(process.env.MONGODB_URL)},294:e=>{e.exports=(e,s,t,a)=>{console.error(e),t.status(500).send(e)}},981:(e,s,t)=>{const a=t(256),o=t(517);e.exports=async function(e,s,t){const{newTag:r}=e.body,n=o.capitalize(r);(await a.findOne({}).exec()).allTags.some((e=>e===n))?s.status(400).json({message:"Tag already exists"}):t()}},954:(e,s,t)=>{const a=t(738),o=a.diskStorage({}),r=a({storage:o,fileFilter:(e,s,t)=>{"image/jpeg"===s.mimetype||"image/png"===s.mimetype?t(null,!0):t({message:"Invalid file type."},!1)}});e.exports=r},870:(e,s,t)=>{const a=t(344);e.exports=(e,s,t)=>{console.log("at verifyJWT");const o=e.headers.authorization||e.headers.Authorization;if(!o?.startsWith("Bearer "))return s.status(401).json({message:"Unauthorized."});const r=o.split(" ")[1];a.verify(r,process.env.ACCESS_TOKEN_SECRET,((a,o)=>{if(a)return s.status(403).json({message:"Forbidden."});e.user=o.UserInfo.username,e.roles=o.UserInfo.roles,t()}))}},256:(e,s,t)=>{const a=t(185),o=new a.Schema({name:{type:String,required:!0,unique:!0},allTags:[String]},{timestamps:!0}),r=a.model("Category",o);e.exports=r},998:(e,s,t)=>{const a=t(185),o=new a.Schema({imageUrl:String,publicId:String},{timestamps:!0}),r=a.model("Image",o);e.exports={Image:r,imageSchema:o}},3:(e,s,t)=>{const a=t(185),{imageSchema:o}=t(998),r=new a.Schema({title:String,subtitle:String,content:String,images:[o],postTags:[String],category:String},{timestamps:!0}),n=a.model("Post",r);e.exports=n},945:(e,s,t)=>{const a=t(185),o=new a.Schema({username:{type:String,required:[!0,"Please provide a username"],unique:!0},password:{type:String,required:[!0,"Please provide a password"]},roles:[{type:String,default:"BasicUser"}],active:{type:Boolean,default:!0}},{timestamps:!0}),r=a.model("User",o);e.exports=r},119:(e,s,t)=>{const a=new(t(860).Router),o=t(919);a.post("/auth",o.handleLogin),a.get("/auth/refresh",o.handleRefreshToken),a.post("/auth/logout",o.handleLogout),a.get("/auth/validatePath/:category",o.validatePath),a.get("/auth/validatePath/:category/:postId",o.validatePath),e.exports=a},437:(e,s,t)=>{const a=t(860),o=t(256),r=new a.Router,n=t(517),i=t(981);t(142).config(),r.get("/api/categories/:category",(async(e,s)=>{try{const t=await o.find({name:n.capitalize(e.params.category)});s.json(t)}catch(e){s.status(400).send(e)}})),r.get("/api/categories",(async(e,s)=>{try{const e=await o.findOne({name:"dummy"}).exec();s.status(200).json(e.allTags)}catch(e){s.status(400).send(e)}})),r.patch("/api/categories/tags",i,(async(e,s)=>{const{newTag:t}=e.body,a=n.capitalize(t);try{await o.findOneAndUpdate({name:"dummy"},{$push:{allTags:a}}),s.status(200).json(a)}catch(e){s.status(400).send(e)}})),r.patch("/api/categories/deleteTag",(async(e,s)=>{const{tagToDelete:t}=e.body;try{await o.findOneAndUpdate({name:"dummy"},{$pull:{allTags:t}}),s.status(200).json({deletedTag:t,message:"Tag deleted"})}catch(e){s.status(400).send(e)}})),e.exports=r},762:(e,s,t)=>{const a=new(t(860).Router),o=t(954).array("images",20),r=t(870),n=t(3),{Image:i}=(t(256),t(998)),{uploadToCloudinary:c,removeFromCloudinary:u}=t(463),d=t(517);t(142).config(),a.get("/api/posts/:category",(async(e,s)=>{try{const t=await n.find({category:d.capitalize(e.params.category)});s.status(200).json(t)}catch(e){s.status(404).send(e)}})),a.get("/api/posts/:category/:postId",(async(e,s)=>{try{const t=await n.findById(e.params.postId);s.status(200).json(t)}catch(e){s.status(400).send(e)}})),a.post("/posts",r,o,(async(e,s)=>{const t=new n(e.body),a=await t.save(),o=e.files;await Promise.all(o.map((async e=>{const s=await c(e.path,"emaJons_dev"),t=new i({publicId:s.public_id,imageUrl:s.url});await n.updateOne({_id:a._id},{$addToSet:{images:[t]}})})));const r=await n.findById(t._id);s.status(200).json(r)})),a.delete("/:category/:postId",r,(async(e,s)=>{console.log("at delete");try{const t=await n.findOne({_id:e.params.postId}).exec();if(!t)return s.status(204).json({message:"No post found with this id."});const a=t.images.map((e=>e.publicId));a.length&&await u(a),await t.deleteOne(),s.status(200).json({message:"post deleted successfully"})}catch(e){s.status(400).send(e)}})),a.patch("/posts/:postId/edit",r,o,(async(e,s)=>{const t=Object.assign({},e.body),a=await n.findOneAndUpdate({_id:e.params.postId},{$set:t},{new:!0}).exec();if(!a)return s.status(204).json({message:"No post found with this id."});const o=e.files;await Promise.all(o.map((async e=>{const s=await c(e.path,"emaJons_dev"),t=new i({publicId:s.public_id,imageUrl:s.url});await n.updateOne({_id:a._id},{$addToSet:{images:[t]}})})));const r=await n.findById(a._id);s.status(200).json(r)})),e.exports=a},979:(e,s,t)=>{const a=t(860).Router(),o=t(919);a.post("/register",o.handleNewUser),e.exports=a},532:(e,s,t)=>{const a=t(119),o=t(762),r=t(437),n=t(979);e.exports={authRouter:a,postRouter:o,categoryRouter:r,registerRouter:n}},463:(e,s,t)=>{const a=t(518);t(142).config(),a.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET}),e.exports={uploadToCloudinary:(e,s)=>a.v2.uploader.upload(e,{folder:s}).then((e=>({url:e.url,public_id:e.public_id}))).catch((e=>{console.log(e)})),removeFromCloudinary:async e=>{await a.v2.api.delete_resources(e,((e,s)=>{console.log(e,s)}))}}},96:e=>{"use strict";e.exports=require("bcrypt")},518:e=>{"use strict";e.exports=require("cloudinary")},710:e=>{"use strict";e.exports=require("cookie-parser")},582:e=>{"use strict";e.exports=require("cors")},142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},344:e=>{"use strict";e.exports=require("jsonwebtoken")},517:e=>{"use strict";e.exports=require("lodash")},185:e=>{"use strict";e.exports=require("mongoose")},738:e=>{"use strict";e.exports=require("multer")},17:e=>{"use strict";e.exports=require("path")}},s={};function t(a){var o=s[a];if(void 0!==o)return o.exports;var r=s[a]={exports:{}};return e[a](r,r.exports,t),r.exports}(()=>{const e=t(860);t(427),t(256);const s=t(532),a=t(294),o=t(17),r=t(582),n=t(710),i=e();i.use(r()),i.use(e.json()),i.use(n()),i.set("view engine","ejs"),i.set("views","./src/views"),i.use(e.static("public")),i.use(e.urlencoded({extended:!0})),i.use(s.authRouter,s.postRouter,s.categoryRouter,s.registerRouter),i.use(a),i.use("/assets",e.static(o.join(__dirname,"../public"))),i.get("/*",((e,s)=>{try{s.render("home")}catch(e){s.status(400).send(e)}})),i.listen(3e3)})()})();