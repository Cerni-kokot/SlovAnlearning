// Meaningful REST-contract checks without a live Supabase service.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const session = {access_token:'test-access',refresh_token:'test-refresh',expires_in:3600,user:{id:'user-1',email:'student@example.com'}};
const storage = new Map();
const requests=[];
let mode='normal';
const context = {window:{dispatchEvent(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},CustomEvent:class {constructor(name,data){this.type=name;this.detail=data.detail}},console,Date,JSON,Error,fetch:async(url,opts)=>{
 requests.push({url,opts});
 let result={};
 if(url.includes('/verify')||url.includes('grant_type=refresh_token'))result=session;
 if(url.includes('/study_progress?')&&opts.method!=='POST')result=[{payload:{done:{'S1.1.1':true}},updated_at:'2026-11-07T00:00:00Z'}];
 if(url.includes('/study_progress?')&&opts.method==='POST')result=[JSON.parse(opts.body)];
 if(url.includes('/functions/'))result={answer:'A mole is a counting unit.'};
 return {ok:true,status:200,json:async()=>result};
}};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/auth.js','utf8'),context);
(async()=>{
 const api=context.window.AtlasCloud;
 assert.equal(await api.init({}),null);
 await assert.rejects(()=>api.signIn('student@example.com'),/setup/);
 await api.init({SUPABASE_URL:'https://test.supabase.co',SUPABASE_ANON_KEY:'public-key'});
 await assert.rejects(()=>api.signIn('bad'),/valid email/);
 await api.signIn('student@example.com');
 assert.equal(JSON.parse(requests.at(-1).opts.body).create_user,true);
 await api.verifyOtp('student@example.com','123456');
 assert.equal((await api.getSession()).user.id,'user-1');
 assert.equal(JSON.parse(requests.find(r=>r.url.includes('/verify')).opts.body).type,'email');
 assert.equal((await api.loadProgress()).payload.done['S1.1.1'],true);
 await api.saveProgress({done:{x:true}});
 assert.equal(JSON.parse(requests.at(-1).opts.body).user_id,'user-1');
 assert.equal(requests.at(-1).opts.headers.Authorization,'Bearer test-access');
 assert.equal(await api.ask([{role:'user',content:'What is a mole?'}],'lesson'),'A mole is a counting unit.');
 // Simulate a stored expired session: initialization must exchange refresh token.
 const expired={...session,expires_at:1};
 storage.set('atlas-cloud-session-v1',JSON.stringify(expired));
 await api.init({SUPABASE_URL:'https://test.supabase.co',SUPABASE_ANON_KEY:'public-key'});
 assert.ok(requests.some(r=>r.url.includes('grant_type=refresh_token')));
 assert.equal((await api.getSession()).access_token,'test-access');
 await api.signOut();assert.equal(await api.getSession(),null);
 await assert.rejects(()=>api.loadProgress(),/Sign in/);
 console.log('Auth REST contract: OTP, session, progress ownership, tutor call and logout passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
