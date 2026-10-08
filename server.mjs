import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const DATA=path.join(ROOT,'data','assets.json');
const PORT=Number(process.env.PORT||3334);
const sessions=new Map();
const loginAttempts=new Map();
const WINDOW_MS=15*60*1000;
const MAX_FAILURES=10;
const adminPassword=process.env.ADMIN_PASSWORD;
if(!adminPassword || adminPassword.length<12){console.error('Configure ADMIN_PASSWORD com pelo menos 12 caracteres.');process.exit(1)}
const adminHash=crypto.scryptSync(adminPassword,'assetpilot-local-admin',64);
fs.mkdirSync(path.dirname(DATA),{recursive:true});
let db=fs.existsSync(DATA)?JSON.parse(fs.readFileSync(DATA,'utf8')):{assets:[],history:[]};
const save=()=>{const temp=DATA+'.tmp';fs.writeFileSync(temp,JSON.stringify(db,null,2));fs.renameSync(temp,DATA)};
const json=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(body))};
const parse=async req=>{let raw='';for await(const part of req){raw+=part;if(raw.length>65536)throw Error('Limite excedido')}return raw?JSON.parse(raw):{}};
const auth=req=>{const token=(req.headers.authorization||'').replace(/^Bearer /,'');const expires=sessions.get(token);if(expires&&expires>Date.now())return true;sessions.delete(token);return false};
const valid=a=>typeof a.name==='string'&&a.name.trim().length>1&&a.name.length<=120&&typeof a.tag==='string'&&a.tag.trim().length>0&&a.tag.length<=50&&['Notebook','Desktop','Monitor','Rede','Periférico','Outro'].includes(a.category)&&['Disponível','Em uso','Manutenção','Baixado'].includes(a.status);
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');const route=url.pathname;
 if(route==='/api/login'&&req.method==='POST'){const key=req.socket.remoteAddress||'local';const now=Date.now();const state=loginAttempts.get(key);if(state&&state.count>=MAX_FAILURES&&now-state.start<WINDOW_MS){res.setHeader('Retry-After',String(Math.ceil((WINDOW_MS-(now-state.start))/1000)));return json(res,429,{error:'Muitas tentativas. Tente novamente mais tarde.'})}const b=await parse(req);const attempt=crypto.scryptSync(String(b.password||''),'assetpilot-local-admin',64);if(!crypto.timingSafeEqual(attempt,adminHash)){const current=state&&now-state.start<WINDOW_MS?state:{start:now,count:0};current.count++;loginAttempts.set(key,current);return json(res,401,{error:'Credenciais inválidas'})}loginAttempts.delete(key);const token=crypto.randomBytes(32).toString('hex');sessions.set(token,Date.now()+8*3600000);return json(res,200,{token,user:{name:'Marcos',role:'ADMIN'}})}
 if(route.startsWith('/api/')){
  if(!auth(req))return json(res,401,{error:'Não autenticado'});
  if(route==='/api/assets'&&req.method==='GET')return json(res,200,db.assets);
  if(route==='/api/history'&&req.method==='GET')return json(res,200,db.history);
  if(route==='/api/assets'&&req.method==='POST'){const a=await parse(req);if(!valid(a))return json(res,400,{error:'Dados inválidos'});if(db.assets.some(x=>x.tag===a.tag.trim()))return json(res,409,{error:'Patrimônio duplicado'});const item={id:crypto.randomUUID(),tag:a.tag.trim(),name:a.name.trim(),category:a.category,status:a.status,location:String(a.location||'').slice(0,120),owner:String(a.owner||'').slice(0,120),serial:String(a.serial||'').slice(0,120),createdAt:new Date().toISOString()};db.assets.push(item);db.history.unshift({id:crypto.randomUUID(),assetId:item.id,action:'Criado',date:new Date().toISOString()});save();return json(res,201,item)}
  const m=route.match(/^\/api\/assets\/([\w-]+)$/);
  if(m&&['PUT','DELETE'].includes(req.method)){const i=db.assets.findIndex(x=>x.id===m[1]);if(i<0)return json(res,404,{error:'Ativo não encontrado'});if(req.method==='DELETE'){db.assets.splice(i,1);db.history.unshift({id:crypto.randomUUID(),assetId:m[1],action:'Excluído',date:new Date().toISOString()});save();return json(res,200,{ok:true})}const a=await parse(req);if(!valid(a))return json(res,400,{error:'Dados inválidos'});if(db.assets.some(x=>x.id!==m[1]&&x.tag===a.tag.trim()))return json(res,409,{error:'Patrimônio duplicado'});db.assets[i]={...db.assets[i],tag:a.tag.trim(),name:a.name.trim(),category:a.category,status:a.status,location:String(a.location||'').slice(0,120),owner:String(a.owner||'').slice(0,120),serial:String(a.serial||'').slice(0,120)};db.history.unshift({id:crypto.randomUUID(),assetId:m[1],action:'Atualizado',date:new Date().toISOString()});save();return json(res,200,db.assets[i])}
  return json(res,404,{error:'Rota não encontrada'});
 }
 if(req.method!=='GET')return json(res,405,{error:'Método não permitido'});
 const files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/style.css':'style.css'};const file=files[route];if(!file)return json(res,404,{error:'Não encontrado'});res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html','X-Content-Type-Options':'nosniff'});fs.createReadStream(path.join(ROOT,'public',file)).pipe(res)
 }catch(e){json(res,400,{error:'Requisição inválida'})}});
if(process.env.NODE_ENV!=='test')server.listen(PORT,'127.0.0.1',()=>console.log(`AssetPilot: http://127.0.0.1:${PORT}`));
export {server,valid};
