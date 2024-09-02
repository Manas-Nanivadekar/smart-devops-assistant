import React, { useState } from 'react';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

const TerminalController = () => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key={1}>npm install majs</TerminalOutput>,
    <TerminalOutput key={2}>majs@1.0.0</TerminalOutput>,
    <TerminalOutput key={3}>added 1 package, and audited 2 packages in 3s</TerminalOutput>
  ]);

  return (
    <div className="container text-center max-w-2xl">
      <Terminal
        height='200px'
        prompt='majs config'
        name='bash'
        colorMode={ColorMode.Dark}
        onInput={terminalInput => console.log(`New terminal input received: '${terminalInput}'`)}
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
};

export default TerminalController;
