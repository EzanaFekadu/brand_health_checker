// app.jsx — mounts the design canvas with style frames
const { DirEditorial, DirWholesome, DirBold, ScoreStudies, Foundation, ReasoningNote } = window;

function App() {
  return (
    <DesignCanvas>
      <DCSection id="intro" title="Brand Health Checker — Style Frames" subtitle="Scan result · warm-natural system · big-numeral score">
        <DCArtboard id="note" label="Design notes" width={540} height={300}><ReasoningNote /></DCArtboard>
        <DCArtboard id="foundation" label="Type & color" width={540} height={260}><Foundation /></DCArtboard>
      </DCSection>

      <DCSection id="directions" title="Result screen — 3 visual directions" subtitle="Same system, different hierarchy & use of color">
        <DCArtboard id="a" label="A · Editorial Calm" width={360} height={740}><DirEditorial /></DCArtboard>
        <DCArtboard id="b" label="B · Wholesome Card" width={360} height={740}><DirWholesome /></DCArtboard>
        <DCArtboard id="c" label="C · Bold Verdict" width={360} height={740}><DirBold /></DCArtboard>
      </DCSection>

      <DCSection id="score" title="Score visualization studies" subtitle="Ways to render the big number — mix into any direction">
        <DCArtboard id="studies" label="Six treatments" width={800} height={300}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}><ScoreStudies /></div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
