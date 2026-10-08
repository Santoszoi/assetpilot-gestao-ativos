import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';
process.env.ADMIN_PASSWORD='senha-forte-de-teste-123';
const {server,valid}=await import('../server.mjs');
test('validação exige patrimônio, nome, categoria e status válidos',()=>{
 assert.equal(valid({tag:'PC-01',name:'Notebook Dell',category:'Notebook',status:'Em uso'}),true);
 assert.equal(valid({tag:'',name:'Notebook Dell',category:'Notebook',status:'Em uso'}),false);
 assert.equal(valid({tag:'PC-01',name:'Notebook Dell',category:'Notebook',status:'Indefinido'}),false);
});
test('login, proteção contra tentativas e autenticação de API',async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const anon=await fetch(base+'/api/assets');assert.equal(anon.status,401);
  for(let i=0;i<10;i++){const r=await fetch(base+'/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:'errada'})});assert.equal(r.status,401)}
  const blocked=await fetch(base+'/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password:'senha-forte-de-teste-123'})});assert.equal(blocked.status,429);assert.ok(blocked.headers.get('retry-after'));
 }finally{await new Promise(resolve=>server.close(resolve))}
});
