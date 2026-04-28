import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore.js';
import { useLobbyStore } from '../store/lobbyStore.js';
import GameBoard from '../components/board/GameBoard.jsx';
import StackInspectModal from '../components/modals/StackInspectModal.jsx';

// ── Mock card definitions ────────────────────────────────────────────
const DEF = {
  PICARD: {
    instanceId:'p1', title:'Jean-Luc Picard', subtitle:'Genial Captain',
    type:'personnel', affiliation:'federation', cost:3, unique:true, species:'Human',
    skills:['Archaeology','Diplomacy','Honor','Leadership'], skillLevels:{},
    keywords:['Commander: U.S.S. Enterprise-D'],
    integrity:8, cunning:6, strength:6,
    gameText:'Commander: U.S.S. Enterprise-D. When you play this personnel, you may download U.S.S. Enterprise-D.',
    collectorInfo:'2 VP 31', stopped:false,
  },
  WORF: {
    instanceId:'p2', title:'Worf', subtitle:'Chief of Security',
    type:'personnel', affiliation:'federation', cost:4, unique:true, species:'Klingon',
    skills:['Anthropology','Honor','Officer','Security'], skillLevels:{Honor:2},
    integrity:8, cunning:5, strength:8,
    gameText:'When your personnel present is about to be stopped by a dilemma, you may discard a card from hand to make this personnel stopped instead.',
    collectorInfo:'4 VP 12', stopped:true,
  },
  TROI: {
    instanceId:'p3', title:'Deanna Troi', subtitle:'Durango',
    type:'personnel', affiliation:'federation', cost:2, unique:true, species:'Betazoid/Human',
    skills:['Anthropology','Honor','Security','Telepathy'], skillLevels:{},
    integrity:6, cunning:5, strength:4,
    gameText:'When an opponent plays a Security personnel or places a Security personnel from hand on a headquarters mission, you may discard two cards from hand to stop that personnel.',
    collectorInfo:'2 N V 4', stopped:false,
  },
  ENTERPRISE: {
    instanceId:'s1', title:'U.S.S. Enterprise-D', subtitle:'Diplomatic Envoy',
    type:'ship', affiliation:'federation', cost:6, unique:true,
    shipClass:'Galaxy Class', range:8, weapons:8, shields:9,
    gameText:'When you complete this mission, if this ship is staffed and at that mission, score 5 points.',
    collectorInfo:'6 VP 51',
  },
  RESISTANCE_RIFLE: {
    instanceId:'e1', title:'Resistance Rifle', type:'equipment',
    affiliation:null, cost:1,
    gameText:'Hand Weapon. While in combat, each of your Bajoran Resistance personnel present is Strength +1.',
    collectorInfo:'1 S V 4',
  },
  // Missions
  EARTH: {
    instanceId:'m1', title:'Earth', subtitle:'Cradle of the Federation',
    type:'mission', missionType:'headquarters', affiliation:'federation', span:2,
    gameText:'You may play Federation cards, Bajoran cards, Maquis cards, and equipment at this mission.',
  },
  FORCAS: {
    instanceId:'m2', title:'Forcas Sector', subtitle:'Fissure Research',
    type:'mission', missionType:'space', affiliation:'federation', span:3, points:35,
    requirements:'Astrometrics, Engineer, Physics, Science, and Cunning > 36',
  },
  LAPIDEAS: {
    instanceId:'m3', title:'Lapideas System', subtitle:'Geological Survey',
    type:'mission', missionType:'planet', affiliation:'federation', span:2, points:30,
    requirements:'Geology, Physics, Science, and Cunning > 30',
  },
  MOAB: {
    instanceId:'m4', title:'Moab IV', subtitle:'Avert Danger',
    type:'mission', missionType:'planet', affiliation:'federation', span:2, points:30,
    requirements:'Astrometrics, Physics, Science, and Cunning > 32',
  },
  SECTOR97: {
    instanceId:'m5', title:'Sector 97', subtitle:'Explore Black Cluster',
    type:'mission', missionType:'space', affiliation:'federation', span:4, points:35,
    requirements:'Astrometrics, Leadership, Physics, Science, and Cunning > 34',
  },
  QONOS:     { instanceId:'om1', title:"Qo'noS",       subtitle:'Heart of the Empire',    type:'mission', missionType:'headquarters', affiliation:'klingon', span:2 },
  VALT:      { instanceId:'om2', title:'Valt Minor',    subtitle:'Brute Force',            type:'mission', missionType:'planet',       affiliation:'klingon', span:2, points:40, requirements:'2 Leadership, 3 Security, and Strength > 38' },
  HONOR:     { instanceId:'om3', title:'Honor the Fallen',                                  type:'mission', missionType:'planet',       affiliation:'klingon', span:3, points:40, requirements:'Engineer, 2 Honor, Medical, Officer, and Integrity > 38' },
  CARDASSIA: { instanceId:'om4', title:'Cardassia IV',  subtitle:'Rescue Prisoners',       type:'mission', missionType:'planet',       affiliation:'klingon', span:1, points:30, requirements:'Leadership, Security, Transporters, and Strength > 30' },
  CRENSEN:   { instanceId:'om5', title:'Crensen Gap',   subtitle:'Protect the Escapees',   type:'mission', missionType:'space',        affiliation:'klingon', span:3, points:30, requirements:'Engineer, Honor, Navigation, and Integrity > 25' },
};

// ── Mock crew data for inspect modals ────────────────────────────────
const ENTERPRISE_CREW = {
  personnel: [DEF.PICARD, DEF.WORF],
  equipment: [DEF.RESISTANCE_RIFLE],
};
const LAPIDEAS_PERSONNEL = {
  personnel: [DEF.TROI, { ...DEF.PICARD, instanceId:'p4', title:'Data', subtitle:'Proud Father', species:'Android', skills:['Anthropology','Engineer','Exobiology','Physics','Programming','Science'], skillLevels:{Programming:2}, integrity:7, cunning:10, strength:10, cost:6, stopped:false }],
  equipment: [],
};

// ── Build mock view model ─────────────────────────────────────────────
function buildMockViewModel(myName, oppName, openInspect) {
  return {
    myId:'player1', myName, oppName,
    myScore:30, oppScore:0,
    myPlanetDone:true, mySpaceDone:false,
    oppPlanetDone:false, oppSpaceDone:false,
    phase:'execute_orders', subPhase:null,
    isMyTurn:true, countersRemaining:4,

    myHand: [
      DEF.PICARD, DEF.WORF,
      DEF.ENTERPRISE,
      { ...DEF.TROI, instanceId:'h3' },
      { ...DEF.PICARD, instanceId:'h4', title:'Beverly Crusher', subtitle:'Encouraging Commander',
        skills:['Biology','Leadership','Medical','Officer'], skillLevels:{Medical:2},
        integrity:6, cunning:6, strength:4, cost:3 },
    ],
    myHandSelectedId: null,

    myDeckCount:28, myDiscardCount:4,
    myDiscardTop:{ instanceId:'disc1', title:'Dark Page', type:'dilemma', cost:2,
                   gameText:'Choose a personnel who has Anthropology or Exobiology to be stopped. If you cannot, randomly select a personnel to be killed.' },
    myDilemmaCount:18, myDilemmaFaceUp:1, myRemovedCount:0,

    myMissions: [
      { mission:DEF.EARTH,    completed:false, overcomeCount:0, hasPersonnel:false, hasMultiplePersonnel:false, ships:[], visitingShips:[] },
      { mission:DEF.FORCAS,   completed:false, overcomeCount:0, hasPersonnel:false, hasMultiplePersonnel:false,
        ships:[{ card:DEF.ENTERPRISE, hasCrew:true, damage:1, rangeUsed:3, stopped:false }],
        visitingShips:[],
        onShipClick: () => openInspect({
          title: 'U.S.S. Enterprise-D — Crew',
          context: 'ship',
          isYours: true,
          ...ENTERPRISE_CREW,
        }),
      },
      { mission:DEF.LAPIDEAS, completed:true,  overcomeCount:2, hasPersonnel:true, hasMultiplePersonnel:true,
        ships:[], visitingShips:[],
        onPersonnelClick: () => openInspect({
          title: 'Lapideas System — Personnel',
          context: 'mission',
          isYours: true,
          ...LAPIDEAS_PERSONNEL,
        }),
      },
      { mission:DEF.MOAB,     completed:false, overcomeCount:0, hasPersonnel:false, hasMultiplePersonnel:false, ships:[], visitingShips:[] },
      { mission:DEF.SECTOR97, completed:false, overcomeCount:1, hasPersonnel:false, hasMultiplePersonnel:false, ships:[], visitingShips:[] },
    ],
    myCoreEvents:[], myBrigCaptives:[], canDraw:false,

    oppHandCount:5,
    oppDeckCount:31, oppDiscardCount:2, oppDiscardTop:null,
    oppDilemmaCount:20, oppDilemmaFaceUp:0, oppRemovedCount:0,

    oppMissions: [
      { mission:DEF.QONOS,     completed:false, overcomeCount:0, hasPersonnel:false, hasMultiplePersonnel:false, ships:[], visitingShips:[] },
      { mission:DEF.VALT,      completed:false, overcomeCount:0, hasPersonnel:true,  hasMultiplePersonnel:false,
        ships:[], visitingShips:[],
        onPersonnelClick: () => openInspect({
          title: 'Valt Minor — Personnel (Opponent)',
          context: 'mission',
          isYours: false,
          personnel: [DEF.PICARD, DEF.WORF], // opponent sees backs only
          equipment: [],
        }),
      },
      { mission:DEF.HONOR,     completed:false, overcomeCount:0, hasPersonnel:false, hasMultiplePersonnel:false, ships:[], visitingShips:[] },
      { mission:DEF.CARDASSIA, completed:false, overcomeCount:0, hasPersonnel:false, hasMultiplePersonnel:false, ships:[], visitingShips:[] },
      { mission:DEF.CRENSEN,   completed:false, overcomeCount:0, hasPersonnel:false, hasMultiplePersonnel:false, ships:[], visitingShips:[] },
    ],
    oppCoreEvents:[], oppBrigCaptives:[],

    logEntries:[
      { id:1, type:'system',  message:'Game started. Player 1 goes first.',               timestamp:Date.now()-120000 },
      { id:2, type:'player1', message:`${myName} drew 7 cards.`,                          timestamp:Date.now()-115000 },
      { id:3, type:'player2', message:`${oppName} drew 7 cards.`,                         timestamp:Date.now()-110000 },
      { id:4, type:'action',  message:`${myName} played U.S.S. Enterprise-D at Earth.`,   timestamp:Date.now()-60000  },
      { id:5, type:'action',  message:`${myName} completed Lapideas System — 30 points!`, timestamp:Date.now()-10000  },
    ],
    chatMessages:[],

    actionPrompt:'Execute orders: move ships, beam personnel, or attempt a mission.',
    actionButtons:[{ id:'end_phase', label:'End Turn', variant:'primary', onClick:()=>{} }],

    onDraw:()=>{}, onDiscardBrowse:()=>{},
    onCardClick:()=>{},
    onMissionClick:()=>{},
    onPersonnelClick:()=>{},
    onShipClick:()=>{},
    onCrewClick:()=>{},
    onCoreCardClick:()=>{},
    onBrigCardClick:()=>{},
  };
}

// ── Component ─────────────────────────────────────────────────────────
export default function GamePage() {
  const { code } = useParams();
  const { gameState, myPlayerId, chatMessages, logEntries } = useGameStore();
  const { room } = useLobbyStore();

  const myName  = room?.players?.find(p => p.isYou)?.name  ?? 'You';
  const oppName = room?.players?.find(p => !p.isYou)?.name ?? 'Opponent';

  // Inspect modal state
  const [inspectModal, setInspectModal] = useState(null); // null | { title, context, isYours, personnel, equipment }

  const openInspect  = (data) => setInspectModal(data);
  const closeInspect = ()     => setInspectModal(null);

  const vm = {
    ...buildMockViewModel(myName, oppName, openInspect),
    chatMessages,
    logEntries: logEntries.length > 0 ? logEntries : buildMockViewModel(myName, oppName, openInspect).logEntries,
  };

  return (
    <>
      <GameBoard vm={vm} />

      <StackInspectModal
        isOpen={!!inspectModal}
        onClose={closeInspect}
        title={inspectModal?.title ?? ''}
        context={inspectModal?.context ?? 'mission'}
        isYours={inspectModal?.isYours ?? true}
        personnel={inspectModal?.personnel ?? []}
        equipment={inspectModal?.equipment ?? []}
      />
    </>
  );
}
