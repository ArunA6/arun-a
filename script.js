const spotlight = document.getElementById('spotlight');

if (spotlight) {
  window.addEventListener('mousemove', (e) => {
    spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    spotlight.classList.add('active');
  });
}

// --- Interactive terminal ---
const termOutput = document.getElementById('term-output');
const termInput = document.getElementById('term-input');
const termPath = document.getElementById('term-path');

if (termOutput && termInput && termPath) {
  const sections = ['education', 'experience', 'projects', 'skills', 'contact'];
  let cwd = '~';
  const history = [];
  let historyIndex = 0;

  // Command registry: add new commands here to extend the terminal
  // (e.g. a future `cd interests/hiking` or `spotify` command).
  const commands = {
    help: {
      description: 'list available commands',
      run: () =>
        Object.keys(commands)
          .sort()
          .map((name) => `${name.padEnd(10)}${commands[name].description}`)
          .join('\n'),
    },
    whoami: {
      description: 'who this terminal belongs to',
      run: () => 'Arun Atchuthananthan — Computer Science Graduate, University of Waterloo.',
    },
    pwd: {
      description: 'print working directory',
      run: () => cwd,
    },
    ls: {
      description: 'list contents of the current directory',
      run: () => (cwd === '~' ? sections.join('  ') : 'nothing here yet'),
    },
    cd: {
      description: 'cd <section> — jump to a section, cd ~ to go back',
      run: (args) => {
        const target = (args[0] || '~').toLowerCase();
        if (target === '~' || target === '/' || target === '..') {
          cwd = '~';
          termPath.textContent = cwd;
          return 'moved to ~';
        }
        if (sections.includes(target)) {
          cwd = `~/${target}`;
          termPath.textContent = cwd;
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
          return `→ jumped to /${target}`;
        }
        return `cd: no such directory: ${args[0]}`;
      },
    },
    cat: {
      description: 'cat resume.pdf — open the resume',
      run: (args) => {
        if (args[0] === 'resume.pdf') {
          window.open('resume.pdf', '_blank');
          return 'opening resume.pdf...';
        }
        return `cat: ${args[0] || ''}: no such file`;
      },
    },
    clear: {
      description: 'clear the terminal output',
      run: () => {
        termOutput.innerHTML = '';
        return null;
      },
    },
  };

  function printLine(typed, response) {
    const entry = document.createElement('div');
    entry.className = 'term-entry';

    const typedLine = document.createElement('p');
    typedLine.className = 'term-typed';
    typedLine.setAttribute('data-prompt', `arun@portfolio:${cwd}$ `);
    typedLine.textContent = typed;
    entry.appendChild(typedLine);

    if (response) {
      const responseLine = document.createElement('p');
      responseLine.className = 'term-response';
      responseLine.textContent = response;
      entry.appendChild(responseLine);
    }

    termOutput.appendChild(entry);
    entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function runCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyIndex = history.length;

    const [name, ...args] = trimmed.split(/\s+/);
    const cmd = commands[name.toLowerCase()];

    if (name.toLowerCase() === 'clear') {
      cmd.run();
      return;
    }

    const response = cmd
      ? cmd.run(args)
      : `command not found: ${name}. Type 'help' for a list of commands.`;
    printLine(trimmed, response);
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runCommand(termInput.value);
      termInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) historyIndex -= 1;
      termInput.value = history[historyIndex] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      historyIndex = Math.min(historyIndex + 1, history.length);
      termInput.value = history[historyIndex] || '';
    }
  });

  document.querySelector('.terminal-body').addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    termInput.focus();
  });
}
