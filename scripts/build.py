from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]/'content'
out=Path(__file__).resolve().parents[1]/'dist'
read=lambda f:json.loads((root/f).read_text())
base=read('base_topics.json');extra=read('extra_structure.json')+read('extra_reactivity.json');inv=read('source_inventory.json')
a=base+extra
a.sort(key=lambda t:(t['id'][0]=='R',int(t['id'][1:].split('.')[0]),int(t['id'].split('.')[1])))
seen=[]
for t in a:
 for s in t['sections']:
  seen.append(s['id'])
  assert s['id'] in inv,s['id']
  assert bool(s['hl'])==inv[s['id']]['hl'],('level mismatch',s['id'],s['hl'],inv[s['id']]['hl'])
  s['source']={k:v for k,v in inv[s['id']].items() if k!='statement'}
  assert len(s['explain'])>=2 and len(s['steps'])>=3 and len(s['example']['steps'])>=3,s['id']
  s['group']=t['group']
assert set(seen)==set(inv),(set(inv)-set(seen),set(seen)-set(inv))
assert len(seen)==len(set(seen))==165
q=read('base_questions.json')+read('extra_questions.json')
for i,x in enumerate(q):
 x['id']='Q'+str(i+1).zfill(3)
 assert x['topic'] in {t['id'] for t in a}
 if x['kind']=='mcq':assert len(x['options'])==4 and 0<=x['correct']<4
 assert x['marks']>=1
# Input content uses source-derived structure/reactivity group labels, standardized for navigation.
for t in a:t['group']=('Structure' if t['id'][0]=='S' else 'Reactivity')+' '+t['id'][1]
groups={'Structure 1':'Models of the particulate nature of matter','Structure 2':'Models of bonding and structure','Structure 3':'Classification of matter','Reactivity 1':'What drives chemical reactions?','Reactivity 2':'How much, how fast and how far?','Reactivity 3':'What are the mechanisms of chemical change?'}
js='/* Course scope: uploaded Chemistry Guide, first assessment 2025. Teaching prose and practice are original. */\n'
papers=read('official_resources.json')
for p in papers:
 if p['level']=='Both':p['level']='both'
 if p['kind']=='licensed questionbank':p['kind']='questionbank'
for key,val in [('COURSE',a),('QUESTIONS',q),('VIDEOS',read('videos.json')),('PAPERS',papers),('SKILLS',json.loads((Path(__file__).parent/'skills.json').read_text())),('GROUP_NAMES',groups)]:
 js+='const '+key+' = '+json.dumps(val,ensure_ascii=False,separators=(',',':'))+';\n'
(out/'course.js').write_text(js)
# Public coverage audit contains IDs and location, not the uploaded PDF or its full text.
audit={'source':'User-uploaded Chemistry Syllabus 2025.pdf','edition':'First assessment 2025','outcomes':len(seen),'sharedSL':sum(not v['hl'] for v in inv.values()),'HLextensions':sum(v['hl'] for v in inv.values()),'topics':len(a),'practiceQuestions':len(q),'outcomeMap':[{ 'id':s['id'],'title':s['title'],**s['source']} for t in a for s in t['sections']]}
(out/'coverage.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print('Validated:',len(a),'topics;',len(seen),'outcomes;',audit['sharedSL'],'SL;',audit['HLextensions'],'HL extensions;',len(q),'original questions')
