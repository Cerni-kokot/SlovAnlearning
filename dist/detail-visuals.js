/* Additional original scientific diagrams. Spectra are schematic teaching examples, never measured data. */
function detailVisual(s){
 const id=s.id;let z='';const B='#2e88c4',G='#20a18f',O='#d7953b',P='#9c72b6';
 const title=t=>tx(360,25,t,16),foot=t=>tx(360,237,t,12);
 const path=(d,c=B,w=3,dash='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
 const lbl=(x,y,t,sz=15)=>tx(x,y,t,sz);
 const dBond=(x1,y1,x2,y2)=>bond(x1,y1-4,x2,y2-4,2)+bond(x1,y1+4,x2,y2+4,2);
 const multipeak=(x,y,heights,gap=7)=>heights.map((h,i)=>line(x+(i-(heights.length-1)/2)*gap,y,x+(i-(heights.length-1)/2)*gap,y-h,B,2)).join('');
 switch(id){
 case'S2.4.3':{
  z=title('Alloys: differently sized atoms impede layer movement');
  for(let panel=0;panel<2;panel++){
   const ox=panel?401:67;
   for(let r=0;r<3;r++)for(let c=0;c<4;c++){
    let alt=panel&&((r===1&&c===1)||(r===2&&c===3));let x=ox+c*56+(r%2)*20,y=89+r*41;
    if(panel&&r===1&&c===2)x+=10;
    z+=cir(x,y,alt?25:17,alt?'#f1cda5':'#a9d5e8',alt?'#d39e63':'#74adc9',1.6);
   }
  }
  z+=arrow(83,60,245,60,G)+tx(168,211,'Pure metal: regular arrangement',13)+tx(509,211,'Alloy: distorted arrangement',13)+foot('Schematic slice: added atoms can restrict movement and increase hardness');break;
 }
 case'S2.4.4':{
  z=title('A polymer is a long chain—not a line of separate small molecules');
  const chain=(oy,c,phase)=>{let zz='';for(let i=0;i<10;i++){let x=83+i*61,y=oy+Math.sin(i*.85+phase)*13;let nx=83+(i+1)*61,ny=oy+Math.sin((i+1)*.85+phase)*13;if(i<9)zz+=line(x,y,nx,ny,c,4);zz+=cir(x,y,7,c,c,1)}return zz};
  z+=chain(89,B,0)+chain(155,G,1)+[139,270,410,553].map(x=>line(x,111,x,134,'#a9bbca',2,'4 4')).join('')+tx(361,197,'Covalent bonds along each chain; weaker attractions between chains',13)+foot('Chain length, entanglement and interchain attractions affect material properties');break;
 }
 case'S2.4.5':{
  z=title('Addition polymerization of ethene');
  z+=lbl(92,118,'n',18)+lbl(147,118,'CH₂',22)+lbl(255,118,'CH₂',22)+dBond(178,111,221,111)+arrow(305,110,407,110,G);
  z+=lbl(489,118,'CH₂',22)+lbl(596,118,'CH₂',22)+bond(520,111,563,111)+bond(440,111,458,111)+bond(625,111,650,111);
  z+=path('M453 70 H437 V157 H453','#66859c',2)+path('M638 70 H654 V157 H638','#66859c',2)+lbl(670,164,'n',17);
  z+=lbl(195,183,'Double bond opens',14)+lbl(547,183,'Single-bond polymer backbone',14)+foot('Every monomer atom is retained: ideal atom economy = 100%');break;
 }
 case'S2.4.6':{
  z=title('Condensation creates an ester or an amide linkage');
  z+=lbl(115,81,'R–COOH',19)+lbl(272,81,'HO–R′',19)+lbl(193,81,'+',18)+arrow(344,76,424,76,G)+lbl(528,81,'R–CO–O–R′',20)+lbl(644,81,'+ H₂O',14);
  z+=lbl(115,150,'R–COOH',19)+lbl(272,150,'H₂N–R′',19)+lbl(193,150,'+',18)+arrow(344,145,424,145,G)+lbl(528,150,'R–CO–NH–R′',20)+lbl(654,150,'+ H₂O',14);
  z+=line(486,94,571,94,G,3)+line(486,165,582,165,P,3)+lbl(535,114,'ester',13)+lbl(538,187,'amide',13)+foot('Difunctional monomers can repeat these reactions to form polymers');break;
 }
 case'S3.1.10':{
  z=title('Colour from an electronic transition between split d levels');
  z+=line(112,161,307,161,'#6a8aa2',3)+line(112,77,307,77,'#6a8aa2',3)+lbl(109,185,'Lower-energy d set',12)+lbl(112,57,'Higher-energy d set',12);
  z+=path('M222 150 V92 M215 102 L222 90 L229 102',B,3)+cir(222,156,5,B,B)+lbl(265,128,'ΔE = hf',14);
  z+=path('M360 124 Q372 103 384 124 T408 124 T432 124 T456 124',O,3)+lbl(410,157,'light absorbed',13)+lbl(572,104,'Observed colour',17)+lbl(572,136,'is complementary',14)+lbl(572,160,'to absorbed colour',14)+foot('Level separations are schematic; use the supplied colour wheel and data');break;
 }
 case'S3.2.1':case'S3.2.5':{
  z=title('One molecule, different representations: propan-1-ol');
  z+=lbl(170,83,'CH₃CH₂CH₂OH',22)+lbl(170,116,'condensed structural formula',12);
  z+=path('M425 107 L473 78 L521 107 L566 81','#385d7c',4)+lbl(591,84,'OH',19)+lbl(512,141,'skeletal formula',12);
  z+=lbl(360,185,'3 carbons: each unlabelled end or corner is a C atom',14)+foot('Add enough H atoms for each neutral carbon to have four bonds');break;
 }
 case'S3.2.6':{
  z=title('Structural isomers: same formula C₄H₁₀, different connectivity');
  z+=lbl(191,100,'CH₃–CH₂–CH₂–CH₃',21)+lbl(191,154,'butane: straight-chain',14);
  z+=lbl(532,113,'CH₃–CH–CH₃',21)+lbl(532,61,'CH₃',19)+bond(532,76,532,93)+lbl(532,154,'2-methylpropane: branched',14);
  z+=foot('Moving or rotating a drawing is not isomerism; atom connectivity must differ');break;
 }
 case'S3.2.7':{
  z=title('A chiral centre has four different attached groups');
  const chiral=(x,mirror)=>{
   let sign=mirror?-1:1;let out=lbl(x,130,'C',19)+bond(x,110,x,67)+lbl(x,56,'OH',17)+bond(x-13*sign,126,x-76*sign,126)+lbl(x-114*sign,132,'CH₃',17);
   out+=`<path d="M${x+11*sign} 136 L${x+75*sign} 171 L${x+62*sign} 188 Z" fill="#6b9dbc"/>`+lbl(x+98*sign,196,'C₂H₅',16);
   out+=path(`M${x+10*sign} 116 L${x+67*sign} 82`,'#6b9dbc',3,'4 5')+lbl(x+88*sign,77,'H',17);return out;
  };
  // Reflection changes horizontal positions while preserving wedge/dash depth.
  z+=chiral(207,false)+chiral(544,true)+line(371,45,371,204,'#afbed0',2,'4 5')+lbl(371,221,'Enantiomers: non-superimposable mirror-image arrangements',12)+foot('Solid wedge projects forward; dashed bond projects behind the page');break;
 }
 case'S3.2.8':{
  z=title('Mass spectrum: molecular ion and fragment ions (schematic)');
  z+=line(80,198,655,198)+line(80,198,80,55)+lbl(365,226,'m/z',14)+lbl(45,62,'Relative',11)+lbl(45,77,'intensity',11);
  [[105,44,'15'],[215,80,'29'],[302,124,'31'],[456,33,'45'],[570,65,'46']].forEach(([x,h,l])=>z+=line(x,198,x,198-h,B,6)+lbl(x,216,l,12));
  z+=lbl(303,60,'base peak',12)+lbl(570,110,'M⁺',16)+lbl(569,91,'molecular ion',12)+foot('Largest signal = most abundant ion; the molecular ion need not be the tallest');break;
 }
 case'S3.2.9':{
  z=title('IR spectrum: diagnostic regions (schematic carboxylic acid)');
  z+=line(80,196,658,196)+line(80,196,80,51)+lbl(41,64,'% T',12)+lbl(367,233,'Wavenumber / cm⁻¹ (decreases to the right)',12);
  z+=path('M88 64 L142 65 Q158 63 170 91 Q192 144 220 153 Q249 154 266 108 Q279 71 296 65 L369 66 Q384 68 391 161 Q399 180 405 66 L446 65 L455 114 L467 68 L486 96 L499 66 L518 122 L530 79 L543 108 L556 69 L570 123 L583 67 L602 104 L613 71 L647 69',B,2.3);
  z+=lbl(215,181,'broad acid O–H',12)+lbl(398,188,'C=O',12)+lbl(83,214,'4000',11)+lbl(651,214,'500',11)+foot('Downward absorptions are lower transmittance; use data-booklet ranges');break;
 }
 case'S3.2.10':{
  z=title('¹H NMR: number of environments and integration (schematic)');
  z+=line(77,193,654,193)+line(77,193,77,58)+lbl(361,228,'Chemical shift / ppm (decreases to the right)',12)+lbl(81,211,'10',12)+lbl(652,211,'0',12);
  z+=multipeak(425,193,[83],7)+multipeak(567,193,[106],7)+path('M105 166 H403 V135 H546 V89 H643',G,2.5);
  z+=lbl(424,87,'environment A',12)+lbl(565,71,'environment B',12)+lbl(428,122,'2 H',13)+lbl(569,116,'3 H',13)+foot('Signal count = environments; integration compares relative hydrogen counts');break;
 }
 case'S3.2.11':{
  z=title('Splitting in CH₃CH₂Br: neighbouring equivalent H atoms matter');
  z+=line(70,194,654,194)+lbl(350,226,'Chemical shift / ppm → lower values to the right',12);
  z+=multipeak(232,194,[32,96,96,32],13)+multipeak(527,194,[43,86,43],13);
  z+=lbl(232,68,'CH₂ quartet',16)+lbl(527,68,'CH₃ triplet',16)+lbl(232,93,'3 neighbours → 4 peaks',12)+lbl(527,93,'2 neighbours → 3 peaks',12)+foot('Schematic first-order pattern; integration ratio CH₂:CH₃ = 2:3');break;
 }
 case'S3.2.12':{
  z=title('Combined evidence identifies ethanol rather than dimethyl ether');
  z+=lbl(210,89,'CH₃–CH₂–OH',23)+lbl(535,89,'CH₃–O–CH₃',23)+lbl(212,128,'Ethanol: O–H present',13)+lbl(535,128,'Ether: no O–H bond',13);
  z+=multipeak(183,188,[20,40,20],10)+multipeak(255,188,[15,45,45,15],8)+line(428,188,627,188,'#8ca9c1',1)+line(530,188,530,143,B,3)+lbl(210,211,'triplet + quartet',12)+lbl(531,211,'one equivalent proton set',12)+foot('Formula alone is insufficient; IR and NMR test different structural features');break;
 }
 default:return null;
 }
 return svg(z);
}
