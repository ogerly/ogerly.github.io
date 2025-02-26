<template>
  <div class="terminal-component">
    <div class="terminal-output">
      <pre>{{ terminalOutput }}</pre>
    </div>
    <div class="terminal-input">
      <span class="prompt">{{ prompt }}</span>
      <input
        ref="commandInput"
        v-model="command"
        @keyup.enter="executeCommand"
        type="text"
        autocomplete="off"
        autofocus
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'TerminalComponent',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      terminalOutput: this.data.welcomeText || '',
      command: '',
      prompt: '1> ',
      commandHistory: [],
      historyIndex: -1
    }
  },
  mounted() {
    this.focusInput();
  },
  methods: {
    executeCommand() {
      if (!this.command.trim()) {
        this.addOutput(`${this.prompt}`);
        return;
      }

      this.addOutput(`${this.prompt}${this.command}`);

      // Process command
      const cmd = this.command.toLowerCase().trim();
      this.commandHistory.push(this.command);
      this.historyIndex = this.commandHistory.length;

      // Very simple command processing
      switch(cmd) {
        case 'help':
          this.addOutput(
            'Available commands:\n' +
            'help - Show this help\n' +
            'about - About DEVmatrose\n' +
            'list - List files\n' +
            'clear - Clear terminal\n' +
            'date - Show current date\n' +
            'exit - Close terminal'
          );
          break;
        case 'about':
          this.addOutput(
            'DEVmatrose Amiga Terminal v1.0\n' +
            'Created by Alexander Friedland (@ogerly)\n' +
            'Dresden, Germany'
          );
          break;
        case 'list':
        case 'dir':
        case 'ls':
          this.addOutput(
            'Directory: Workbench:\n' +
            'about.info       8KB    ---rw-\n' +
            'skills.info      12KB   ---rw-\n' +
            'projects.info    10KB   ---rw-\n' +
            'contact.info     6KB    ---rw-\n' +
            'readme.txt       2KB    ---rw-'
          );
          break;
        case 'clear':
        case 'cls':
          this.terminalOutput = '';
          break;
        case 'date':
          this.addOutput(new Date().toString());
          break;
        case 'exit':
          this.$emit('close');
          break;
        default:
          this.addOutput(`Unknown command: ${this.command}`);
      }

      this.command = '';
      this.$nextTick(() => {
        this.focusInput();
      });
    },
    addOutput(text) {
      this.terminalOutput += (this.terminalOutput ? '\n' : '') + text;
      this.$nextTick(() => {
        const terminalEl = document.querySelector('.terminal-output');
        if (terminalEl) {
          terminalEl.scrollTop = terminalEl.scrollHeight;
        }
      });
    },
    focusInput() {
      this.$refs.commandInput.focus();
    }
  }
}
</script>

<style scoped>
.terminal-component {
  background-color: #111;
  color: #aaa;
  font-family: 'Topaz', monospace;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px;
  min-height: 300px;
}

.terminal-output {
  flex-grow: 1;
  overflow-y: auto;
  white-space: pre-wrap;
  padding: 5px;
  background-color: #000;
}

.terminal-input {
  display: flex;
  padding: 5px;
  background-color: #000;
  border-top: 1px solid #333;
}

.prompt {
  color: #0f0;
  margin-right: 5px;
}

input {
  background: transparent;
  border: none;
  color: #0f0;
  flex-grow: 1;
  font-family: 'Topaz', monospace;
  outline: none;
}
</style>
