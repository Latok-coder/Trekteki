/**
 * ScoreTracker — shows both players' scores and mission completion badges.
 */
export default function ScoreTracker({
  myScore = 0,
  oppScore = 0,
  myName = 'You',
  oppName = 'Opponent',
  myPlanet = false,
  mySpace = false,
  oppPlanet = false,
  oppSpace = false,
}) {
  return (
    <div className="flex items-center gap-4 px-3 py-1.5 bg-board-surface/80
                    border border-board-border rounded-lg">
      {/* Opponent */}
      <PlayerScore
        name={oppName}
        score={oppScore}
        planet={oppPlanet}
        space={oppSpace}
        color="text-red-400"
      />

      {/* Divider */}
      <div className="w-px h-8 bg-board-border" />

      {/* You */}
      <PlayerScore
        name={myName}
        score={myScore}
        planet={myPlanet}
        space={mySpace}
        color="text-lcars-blue"
        isYou
      />
    </div>
  );
}

function PlayerScore({ name, score, planet, space, color, isYou }) {
  const pct = Math.min(100, (score / 100) * 100);

  return (
    <div className="flex flex-col gap-0.5 min-w-[80px]">
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] uppercase tracking-wider ${color} truncate max-w-[60px]`}>
          {isYou ? 'You' : name}
        </span>
        <span className={`font-bold text-base leading-none ${color}`}>{score}</span>
      </div>

      {/* Progress bar to 100 */}
      <div className="w-full h-1 bg-board-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isYou ? 'bg-lcars-blue' : 'bg-red-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Win condition pips */}
      <div className="flex gap-1 mt-0.5">
        <Pip label="🌍" done={planet} title="Planet mission complete" />
        <Pip label="🚀" done={space}  title="Space mission complete" />
      </div>
    </div>
  );
}

function Pip({ label, done, title }) {
  return (
    <span
      title={title}
      className={`text-[10px] transition-opacity ${done ? 'opacity-100' : 'opacity-25'}`}
    >
      {label}
    </span>
  );
}
