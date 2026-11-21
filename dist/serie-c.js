'use strict';

const crestsC = ["serie-c/0.svg","serie-c/1.svg","serie-c/2.svg","serie-c/3.svg","serie-c/4.svg","serie-c/5.svg","serie-c/6.png","serie-c/7.png","serie-c/8.svg","serie-c/9.svg","serie-c/10.svg","serie-c/11.svg","serie-c/12.svg","serie-c/13.png","serie-c/14.svg","serie-c/15.svg","serie-c/16.svg","serie-c/17.svg","serie-c/18.svg","serie-c/19.svg","serie-c/20.svg","serie-c/21.svg","serie-c/22.svg","serie-c/23.svg"];
const clubsC = [
  ['ABC','ABC'], ['América-MG','AME'], ['Amazonas','AMZ'], ['Anápolis','ANA'],
  ['ASA','ASA'], ['Avaí','AVA'], ['Barra','BAR'], ['Botafogo-PB','BOT'],
  ['Brusque','BRU'], ['Caxias','CAX'], ['Figueirense','FIG'], ['Floresta','FLO'],
  ['Gama','GAM'], ['Goiatuba','GTB'], ['Guarani','GUA'], ['Ituano','ITU'],
  ['Londrina','LON'], ['Maranhão','MAR'], ['Nacional-AM','NAC'], ['Paysandu','PAY'],
  ['Ponte Preta','PON'], ['Uberlândia','UBE'], ['Volta Redonda','VOL'], ['Ypiranga-RS','YPI']
];
const emptyC = () => ({round:0, regular:{}, groups:{}, final:{}, penalties:['',''], groupKey:'', finalKey:''});
let seasonC = emptyC();

function turnC(ids) {
  const ring = [...ids];
  return Array.from({length:ids.length-1}, (_,round) => {
    const games = Array.from({length:ids.length/2}, (_,slot) => {
      const pair = [ring[slot],ring[ring.length-1-slot]];
      return (slot===0 ? round%2 : slot%2) ? pair.reverse() : pair;
    });
    ring.splice(1,0,ring.pop());
    return games;
  });
}
const scheduleC = turnC(clubsC.map((_,id)=>id));
const phaseDatesC = [
  // Primeira fase
  [4,4],[4,11],[4,18],[4,25],[5,2],[5,9],[5,16],[5,23],[5,30],
  [6,6],[6,13],[6,18],[7,11],[7,18],[7,24],
  [8,1],[8,4],[8,8],[8,15],[8,22],[8,29],[9,5],[9,12],
  // Quadrangulares e final
  [9,19],[9,26],[10,3],[10,10],[10,13],[10,17],[10,24],[10,31]
].map(([month,day])=>Date.UTC(2027,month-1,day));
const compareC = (a,b) => b.p-a.p||b.v-a.v||(a.sg>b.sg?-1:a.sg<b.sg?1:0)||(a.gp>b.gp?-1:a.gp<b.gp?1:0);
const alphabeticalC = (a,b) => clubsC[a.id][0].localeCompare(clubsC[b.id][0],'pt-BR');
function tableC(ids, calendar, scores) {
  const rows=ids.map(id=>({id,p:0,j:0,v:0,form:[],gp:0n,sg:0n}));
  const byId=new Map(rows.map(row=>[row.id,row]));
  const direct=new Map();
  let complete=true;
  calendar.forEach((games,r)=>games.forEach(([home,away],m)=>{
    if (!byId.has(home)||!byId.has(away)) return;
    const score=scores[r]?.[m];
    if (!completeScore(score)) {complete=false;return;}
    const [a,b]=score.map(BigInt);
    for (const [id,gf,ga] of [[home,a,b],[away,b,a]]) {
      const row=byId.get(id);
      row.j++;
      row.form.push(gf>ga?'V':gf===ga?'E':'D');
      row.gp+=gf;
      row.sg+=gf-ga;
      row.p+=gf>ga?3:gf===ga?1:0;
      if(gf>ga) row.v++;
    }
    const key=[home,away].sort((x,y)=>x-y).join('-');
    direct.set(key,(direct.get(key)??0n)+(home<away?a-b:b-a));
  }));
  rows.sort((a,b)=>compareC(a,b)||alphabeticalC(a,b));
  for(let i=0;i<rows.length;) {
    let end=i+1;
    while(end<rows.length&&!compareC(rows[i],rows[end])) end++;
    if(end-i===2){
      const [a,b]=rows.slice(i,end);
      const key=[a.id,b.id].sort((x,y)=>x-y).join('-');
      const margin=(direct.get(key)??0n)*(a.id<b.id?1n:-1n);
      if(margin<0n) [rows[i],rows[i+1]]=[b,a];
    }
    i=end;
  }
  return {rows,complete};
}
function tournamentC() {
  const regular=tableC(clubsC.map((_,id)=>id),scheduleC,seasonC.regular);
  if(!regular.complete)return {regular};
  const groups=[[0,3,4,7],[1,2,5,6]].map(positions=>positions.map(i=>regular.rows[i].id));
  const groupKey=groups.flat().join(',');
  if(seasonC.groupKey!==groupKey) {
    seasonC.groupKey=groupKey;
    seasonC.groups={};
    seasonC.finalKey='';
  }
  const turns=groups.map(turnC);
  const groupSchedule=Array.from({length:6},(_,r)=>turns.flatMap(turn=>
    r<3?turn[r]:turn[r-3].map(([a,b])=>[b,a])
  ));
  const groupTables=groups.map(ids=>tableC(ids,groupSchedule,seasonC.groups));
  if(!groupTables.every(group=>group.complete)) return {regular,groupSchedule,groupTables};
  const leaders=groupTables.map(group=>{
    const leader=group.rows[0], first=regular.rows.find(row=>row.id===leader.id);
    return {id:leader.id,p:first.p+leader.p,v:first.v+leader.v,sg:first.sg+leader.sg};
  }).sort((a,b)=> b.p-a.p||b.v-a.v||(a.sg>b.sg?-1:a.sg<b.sg?1:0)||alphabeticalC(a,b));
  const [better,other]=leaders.map(leader=>leader.id);
  const finalKey=better+'-'+other;
  if(seasonC.finalKey!==finalKey) {
    seasonC.finalKey=finalKey;
    seasonC.final={};
    seasonC.penalties=['',''];
  }
  return {regular,groupSchedule,groupTables,finalSchedule:[[[other,better]],[[better,other]]]};
}
function matchDayC(round,match) {
  const date=new Date(phaseDatesC[round]);
  // Mantém a abertura, a retomada e os dois jogos da final nas datas-base.
  const splitWeekend=date.getUTCDay()===0 && round!==0 && round!==12 && round<29;
  const saturdaySlots=round<23?6:2;
  if(splitWeekend && match<saturdaySlots) date.setUTCDate(date.getUTCDate()-1);
  const slot=splitWeekend && match>=saturdaySlots ? match-saturdaySlots : match;
  const time=round>=23 ? (slot<(splitWeekend?1:2)?'16:00':'18:30') :
    slot<(splitWeekend?2:4)?'16:00':slot<(splitWeekend?4:8)?'18:30':'20:30';
  return {datetime:date.toISOString().slice(0,10)+'T'+time+'-03:00',
    label:weekdayNames[date.getUTCDay()]+', '+date.getUTCDate()+'/'+String(date.getUTCMonth()+1).padStart(2,'0')+' · '+time};
}
function currentC(data) {
  const round=seasonC.round;
  if(round<23) return {games:scheduleC[round],scores:seasonC.regular,index:round};
  if(round<29) return {games:data.groupSchedule[round-23],scores:seasonC.groups,index:round-23};
  return {games:data.finalSchedule.flat(),scores:seasonC.final,index:0};
}
function capC(data) {return data.finalSchedule?29:data.groupSchedule?28:22;}
function rowsC(rows,stage) {
  return rows.map((row,i)=>{
    const [name]=clubsC[row.id];
    const color=stage==='group'?(i<2?'lib':'none'):i<8?'sula':i>=22?'drop':'none';
    return '<tr><td class="pos" style="--zone:var(--'+color+')">'+(i+1)+'</td><th scope="row"><span class="club-cell">'+crestC(row.id,17,17)+name+'</span></th>'+['p','j','v','sg'].map(key=>'<td>'+row[key]+'</td>').join('')+percentageCell(row)+formCell(row.form)+'</tr>';
  }).join('');
}
function crestC(id,width,height) {
  return '<img src="'+crestsC[id]+'" alt="" width="'+width+'" height="'+height+'">';
}
function dateLabelC(round) {
  if(round<23)return String(round+1);
  if(round<29)return 'Q'+(round-22);
  return 'Final';
}
function finalResultC(data) {
  if(!data.finalSchedule)return null;
  const ida=seasonC.final[0]?.[0], volta=seasonC.final[0]?.[1];
  if(!completeScore(ida)||!completeScore(volta))return null;
  const [better,other]=data.finalSchedule[1][0];
  const diff=BigInt(ida[1])+BigInt(volta[0])-BigInt(ida[0])-BigInt(volta[1]);
  const kicks=seasonC.penalties;
  const winner=diff>0n?better:diff<0n?other:
    completeScore(kicks)&&BigInt(kicks[0])!==BigInt(kicks[1])?(BigInt(kicks[0])>BigInt(kicks[1])?better:other):null;
  const badge=id=>'<span class="final-club" title="'+clubsC[id][0]+'">'+crestC(id,20,20)+clubsC[id][1]+'</span>';
  const title=winner===null?'':'<span><strong>Campeão:</strong> '+badge(winner)+'</span><span><strong>Vice:</strong> '+badge(winner===better?other:better)+'</span>';
  return {title,tied:diff===0n,clubs:[better,other]};
}
function extraC(data) {
  const box=$('serie-c-status');
  const result=finalResultC(data);
  if(seasonC.round!==29 || !result) {box.hidden=true;return;}
  const penalties=result.tied ? '<div class="penalties-c">Pênaltis · '+result.clubs.map((id,side)=>
    '<label>'+clubsC[id][0]+' <input class="goal" inputmode="numeric" data-penalty="'+side+'" aria-label="Pênaltis de '+clubsC[id][0]+'" value="'+seasonC.penalties[side]+'"></label>'
  ).join(' × ')+'</div>' : '';
  box.hidden=!result.title&&!penalties;
  box.innerHTML='<div id="serie-c-winner">'+result.title+'</div>'+penalties;
}
function renderC(refreshFixtures=true) {
  const data=tournamentC();
  const round=seasonC.round=Math.min(seasonC.round,capC(data));
  const groupsVisible=round>=23;
  $('table').innerHTML=groupsVisible?data.groupTables.map((group,i)=>
    '<tr class="group-label"><th colspan="8" scope="rowgroup">Grupo '+(i?'C':'B')+'</th></tr>'+rowsC(group.rows,'group')).join(''):
    rowsC(data.regular.rows,'regular');
  $('legend').innerHTML=groupsVisible?'<span class="legend-lib">Acesso (1º e 2º de cada grupo)</span>':
    '<span class="legend-sula">Quadrangulares (1º ao 8º)</span><span class="legend-drop">Rebaixamento (23º e 24º)</span>';
  $('round').innerHTML=[round-1,round,round+1].map(index=>{
    if(index<0||index>capC(data))return '<span aria-hidden="true"></span>';
    const label=dateLabelC(index);
    const fullLabel=index<23?'Rodada '+label:index<29?'Quadrangulares · rodada '+(index-22):label;
    return '<button type="button" data-round="'+index+'" aria-label="'+fullLabel+'" title="'+fullLabel+'"'+
      (index===round?' aria-current="true"':'')+'>'+label+'</button>';
  }).join('');
  if(refreshFixtures){
    const current=currentC(data);
    const fixtures=$('fixtures');
    fixtures.toggleAttribute('data-playoffs',round>=23);
    fixtures.toggleAttribute('data-serie-c',true);
    fixtures.toggleAttribute('data-final',round===29);
    fixtures.innerHTML=current.games.map(([home,away],match)=>{
      const score=current.scores[current.index]?.[match]??['',''];
      const day=round===29?matchDayC(round+match,0):matchDayC(round,match);
      const label=(round>=29?(match===0?'Ida':'Volta')+' · ':round>=23?'Grupo '+(match<2?'B':'C')+' · ':'')+day.label;
      return fixtureMarkup(home,away,match,score,{...day,label},clubsC,crestC);
    }).join('');
  }
  extraC(data);
}
function scoreC(event) {
  const field=event.target;
  if(!field.matches('input.goal[data-match]'))return;
  const current=currentC(tournamentC());
  const {match,side}=field.dataset;
  const round=current.scores[current.index]??=current.games.map(()=>['','']);
  if(field.value!==''&&!isGoal(field.value)){field.value=round[match][side];return;}
  const before=round[match].every(isGoal);
  round[match][side]=field.value;
  if(seasonC.round>=29&&before)seasonC.penalties=['',''];
  renderC(false);
}
function updatePenaltiesC(event) {
  const field=event.target;
  if(!field.matches('input[data-penalty]'))return;
  const side=field.dataset.penalty;
  if(field.value!==''&&!isGoal(field.value)){field.value=seasonC.penalties[side];return;}
  seasonC.penalties[side]=field.value;
  $('serie-c-winner').innerHTML=finalResultC(tournamentC()).title;
}
