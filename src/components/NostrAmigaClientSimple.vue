<template>
  <div class="amiga-container">
    <div class="amiga-title-bar">
      <div class="amiga-title">NostrOS 1.3</div>
      <div class="amiga-buttons">
        <button class="amiga-button minimize"></button>
        <button class="amiga-button maximize"></button>
        <button class="amiga-button close"></button>
      </div>
    </div>
    
    <div class="amiga-screen">
      <!-- Startup Animation -->
      <div v-if="state === 'startup'" class="amiga-startup">
        <div class="amiga-logo">
          <div class="amiga-logo-text">NostrOS 1.3</div>
          <div class="amiga-loading">
            <p>Initializing Nostr Protocol...</p>
            <div class="amiga-progress-bar">
              <div :style="{ width: startupProgress + '%' }" class="amiga-progress"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Welcome & Info Screen -->
      <div v-else-if="state === 'welcome'" class="amiga-welcome">
        <h2>Welcome to DEVmatrose NostrOS</h2>
        <div class="amiga-info-box">
          <p><strong>What is Nostr?</strong></p>
          <p>Nostr is a decentralized social network protocol that enables censorship-resistant communication.</p>
          <p>By using this client, you'll experience decentralized messaging while connecting with Alexander.</p>
          <p><strong>Why use NostrOS?</strong></p>
          <p>• Privacy-focused: Your keys, your data</p>
          <p>• Decentralized: No single point of control</p>
          <p>• Global: Connect to a worldwide network</p>
        </div>
        <div class="amiga-button-row">
          <button @click="state = 'login'" class="amiga-button-primary">Continue</button>
        </div>
      </div>
      
      <!-- Login Screen -->
      <div v-else-if="state === 'login'" class="amiga-login">
        <h2>NostrOS - Your Gateway to Decentralized Communication</h2>
        <div class="amiga-menu">
          <button @click="state = 'create'" class="amiga-menu-item">Create New Nostr Identity</button>
          <button @click="state = 'load'" class="amiga-menu-item">Use Existing Identity</button>
          <button @click="state = 'welcome'" class="amiga-menu-item secondary">Learn About Nostr</button>
        </div>
      </div>
      
      <!-- Create Account Screen -->
      <div v-else-if="state === 'create'" class="amiga-create">
        <h2>Create Your Nostr Identity</h2>
        <div class="amiga-info-box small">
          <p>Your identity consists of a public and private key pair. The public key is your address, while the private key controls your account.</p>
        </div>
        <div class="amiga-form">
          <div class="amiga-form-group">
            <label>Your Display Name:</label>
            <input v-model="username" type="text" class="amiga-input" />
          </div>
          <div class="amiga-actions">
            <button @click="createSimulatedAccount" class="amiga-button-primary">Generate Keys</button>
            <button @click="state = 'login'" class="amiga-button-secondary">Back</button>
          </div>
        </div>
        
        <div v-if="keyCreated" class="amiga-key-result">
          <p>Your Nostr identity has been generated:</p>
          <div class="amiga-key-display">
            <p><strong>Public Key (your address):</strong> {{ publicKey }}</p>
            <p><strong>Private Key (keep secret!):</strong> {{ privateKey }}</p>
          </div>
          <p class="amiga-warning">⚠️ IMPORTANT: Save your private key securely! It cannot be recovered if lost.</p>
          <button @click="proceedToChat" class="amiga-button-primary">Enter NostrOS</button>
        </div>
      </div>
      
      <!-- Load Account Screen -->
      <div v-else-if="state === 'load'" class="amiga-load">
        <h2>Access Your Nostr Identity</h2>
        <div class="amiga-info-box small">
          <p>Enter your credentials to connect with your existing Nostr identity.</p>
        </div>
        <div class="amiga-form">
          <div class="amiga-form-group">
            <label>Your Display Name:</label>
            <input v-model="username" type="text" class="amiga-input" />
          </div>
          <div class="amiga-form-group">
            <label>Your Private Key:</label>
            <input v-model="privateKey" type="password" class="amiga-input" />
          </div>
          <div class="amiga-actions">
            <button @click="loadSimulatedAccount" class="amiga-button-primary">Login</button>
            <button @click="state = 'login'" class="amiga-button-secondary">Back</button>
          </div>
        </div>
      </div>
      
      <!-- Chat Hub Screen -->
      <div v-else-if="state === 'chat-hub'" class="amiga-chat-hub">
        <h2>NostrOS Communication Hub</h2>
        <div class="amiga-info-box">
          <p>Welcome to your Nostr communication center, {{ username }}!</p>
          <p>From here you can participate in the global conversation or send direct messages.</p>
        </div>
        
        <div class="amiga-menu">
          <button @click="enterGlobalChat" class="amiga-menu-item">
            <div class="menu-icon global-chat-icon"></div>
            <div class="menu-content">
              <h3>Global Chat</h3>
              <p>Join the public conversation with the Nostr community</p>
            </div>
          </button>
          
          <button @click="enterDirectChat" class="amiga-menu-item">
            <div class="menu-icon direct-chat-icon"></div>
            <div class="menu-content">
              <h3>Message Alexander</h3>
              <p>Start a private conversation with DEVmatrose founder</p>
            </div>
          </button>
          
          <button @click="state = 'profile'" class="amiga-menu-item secondary">
            <div class="menu-icon profile-icon"></div>
            <div class="menu-content">
              <h3>Your Profile</h3>
              <p>View and manage your Nostr identity</p>
            </div>
          </button>
        </div>
      </div>
      
      <!-- User Profile Screen -->
      <div v-else-if="state === 'profile'" class="amiga-profile">
        <h2>Your Nostr Profile</h2>
        <div class="amiga-profile-card">
          <div class="profile-header">
            <div class="profile-avatar"></div>
            <div class="profile-name">{{ username }}</div>
          </div>
          
          <div class="profile-details">
            <div class="profile-item">
              <div class="profile-label">Public Key:</div>
              <div class="profile-value">{{ shortenKey(publicKey) }}</div>
              <button @click="copyToClipboard(publicKey)" class="amiga-button-small">Copy</button>
            </div>
            
            <div class="profile-item">
              <div class="profile-label">Nostr Address:</div>
              <div class="profile-value">{{ username }}@nostros.devmatrose.com</div>
              <button @click="copyToClipboard(username + '@nostros.devmatrose.com')" class="amiga-button-small">Copy</button>
            </div>
          </div>
          
          <div class="profile-actions">
            <button @click="state = 'chat-hub'" class="amiga-button-primary">Back to Hub</button>
            <button @click="logOut" class="amiga-button-secondary">Log Out</button>
          </div>
        </div>
      </div>
      
      <!-- Global Chat Screen -->
      <div v-else-if="state === 'chat' && chatMode === 'global'" class="amiga-chat">
        <div class="chat-header">
          <div class="chat-title">
            <h2>Global Chat</h2>
            <div class="chat-subtitle">Public conversation visible to everyone</div>
          </div>
          <div class="chat-actions">
            <button @click="state = 'chat-hub'" class="amiga-button-secondary small">Back to Hub</button>
            <button @click="toggleChatMode" class="amiga-button-primary small">Message Alexander</button>
          </div>
        </div>
        
        <div class="amiga-chat-info">
          <div class="relay-info">
            <p>Connected as: {{ username }}</p>
            <div class="amiga-relay-status">
              <p>Relays: {{ connectedRelaysCount }}/{{ relays.length }} connected</p>
              <div class="relay-indicators">
                <span v-for="(relay, index) in relays" :key="index" 
                      class="relay-dot" :class="{ 'connected': relay.connected }"></span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="amiga-messages">
          <div v-for="(message, index) in globalMessages" :key="index" 
               class="amiga-message" :class="{ 'own-message': message.own }">
            <div class="message-header">
              <strong>{{ message.author }}</strong>
              <span>{{ message.timestamp }}</span>
            </div>
            <p>{{ message.content }}</p>
          </div>
        </div>
        
        <div class="amiga-chat-input">
          <input v-model="newMessage" type="text" class="amiga-input" 
                 placeholder="Type your message to global chat..." @keyup.enter="sendGlobalMessage" />
          <button @click="sendGlobalMessage" class="amiga-button-primary">Send</button>
        </div>
      </div>
      
      <!-- Direct Message Screen -->
      <div v-else-if="state === 'chat' && chatMode === 'direct'" class="amiga-chat direct-chat">
        <div class="chat-header">
          <div class="chat-title">
            <h2>Message with Alexander</h2>
            <div class="chat-subtitle">Private encrypted conversation</div>
          </div>
          <div class="chat-actions">
            <button @click="state = 'chat-hub'" class="amiga-button-secondary small">Back to Hub</button>
            <button @click="toggleChatMode" class="amiga-button-primary small">Global Chat</button>
          </div>
        </div>
        
        <div class="amiga-chat-info direct-chat-info">
          <div class="contact-info">
            <div class="contact-avatar"></div>
            <div class="contact-details">
              <div class="contact-name">Alexander Friedland</div>
              <div class="contact-pubkey">{{ shortenKey(alexanderPubkey) }}</div>
            </div>
          </div>
          <div class="encryption-badge">
            <span class="encryption-icon">🔒</span> End-to-end encrypted
          </div>
        </div>
        
        <div class="amiga-messages">
          <div v-for="(message, index) in directMessages" :key="index" 
               class="amiga-message" :class="{ 'own-message': message.own }">
            <div class="message-header">
              <strong>{{ message.author }}</strong>
              <span>{{ message.timestamp }}</span>
            </div>
            <p>{{ message.content }}</p>
          </div>
        </div>
        
        <div class="amiga-chat-input">
          <input v-model="newDirectMessage" type="text" class="amiga-input" 
                 placeholder="Type your message to Alexander..." @keyup.enter="sendDirectMessage" />
          <button @click="sendDirectMessage" class="amiga-button-primary">Send</button>
        </div>
      </div>
    </div>
    
    <div class="amiga-statusbar">
      <div>Status: {{ statusMessage }}</div>
      <div>{{ currentTime }}</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'NostrAmigaClientSimple',
  setup() {
    // App state
    const state = ref('startup');
    const startupProgress = ref(0);
    const statusMessage = ref('Booting NostrOS 1.3...');
    const currentTime = ref('');
    const chatMode = ref('global'); // 'global' or 'direct'
    
    // User data with environment variables
    const username = ref(import.meta.env.VITE_NOSTR_USER_NAME || '');
    const publicKey = ref(import.meta.env.VITE_NOSTR_PUBLIC_KEY || '');
    const privateKey = ref(import.meta.env.VITE_NOSTR_PRIVATE_KEY || '');
    const keyCreated = ref(!!import.meta.env.VITE_NOSTR_PRIVATE_KEY);
    
    // Alexander's public key (website owner)
    const alexanderPubkey = ref('9051c383098f3ce60eda261242809236b866e293b356c0f5e58bff414d0cdde4');
    
    // Chat data
    const globalMessages = ref([]);
    const directMessages = ref([]);
    const newMessage = ref('');
    const newDirectMessage = ref('');
    
    // Default relays - these are some commonly used Nostr relays
    const relays = ref([
      { url: 'wss://relay.damus.io', connected: false },
      { url: 'wss://relay.nostr.info', connected: false },
      { url: 'wss://nostr-pub.wellorder.net', connected: false },
      { url: 'wss://nostr.fmt.wiz.biz', connected: false },
      { url: 'wss://relay.nostr.band', connected: false }
    ]);
    
    // Computed properties
    const connectedRelaysCount = computed(() => {
      return relays.value.filter(relay => relay.connected).length;
    });
    
    // Timer for updating current time
    let clockTimer = null;
    
    // Demo welcome messages for global chat
    const demoGlobalMessages = [
      {
        id: '1',
        author: 'System',
        content: 'Welcome to NostrOS Global Chat! This is a simulated public chat environment.',
        timestamp: getTimeString(),
        own: false
      },
      {
        id: '2',
        author: 'NostrBot',
        content: 'Type a message below to interact with the global chat. Anyone on the network can see these messages.',
        timestamp: getTimeString(),
        own: false
      },
      {
        id: '3',
        author: 'alice',
        content: 'Has anyone seen the latest Bitcoin price? It\'s going to the moon! 🚀',
        timestamp: getTimeString(),
        own: false
      },
      {
        id: '4',
        author: 'bob21',
        content: 'I just set up my own Nostr relay. It\'s amazing how easy it was!',
        timestamp: getTimeString(),
        own: false
      }
    ];
    
    // Demo welcome messages for direct chat
    const demoDMMessages = [
      {
        id: '1',
        author: 'Alexander',
        content: 'Hello! Thanks for reaching out through NostrOS. How can I help you today?',
        timestamp: getTimeString(),
        own: false
      }
    ];
    
    // Methods
    const updateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString();
    };
    
    function getTimeString() {
      return new Date().toLocaleTimeString();
    }
    
    const simulateStartup = () => {
      const interval = setInterval(() => {
        startupProgress.value += 5;
        if (startupProgress.value >= 100) {
          clearInterval(interval);
          state.value = 'welcome'; // Show welcome screen first
          statusMessage.value = 'Ready';
        }
      }, 200);
    };
    
    const createSimulatedAccount = () => {
      if (!username.value) {
        statusMessage.value = 'Error: Username required';
        return;
      }
      
      // Generate random hex strings as simulated keys
      privateKey.value = Array.from(Array(64))
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
      
      publicKey.value = Array.from(Array(64))
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
      
      keyCreated.value = true;
      statusMessage.value = 'Keys generated successfully';
    };
    
    // Modify loadSimulatedAccount to check for environment variables
    const loadSimulatedAccount = () => {
      // If we have environment variables and no manual input, use the env vars
      if (!username.value && import.meta.env.VITE_NOSTR_USER_NAME) {
        username.value = import.meta.env.VITE_NOSTR_USER_NAME;
      }
      
      if (!privateKey.value && import.meta.env.VITE_NOSTR_PRIVATE_KEY) {
        privateKey.value = import.meta.env.VITE_NOSTR_PRIVATE_KEY;
        publicKey.value = import.meta.env.VITE_NOSTR_PUBLIC_KEY;
      }

      if (!username.value || !privateKey.value) {
        statusMessage.value = 'Error: Username and private key required';
        return;
      }
      
      proceedToChat();
    };
    
    const proceedToChat = () => {
      state.value = 'chat-hub'; // Go to chat hub instead of directly to chat
      statusMessage.value = 'Welcome to NostrOS';
      simulateConnectingToRelays();
      
      // Pre-load messages
      globalMessages.value = [...demoGlobalMessages];
      directMessages.value = [...demoDMMessages];
    };
    
    const enterGlobalChat = () => {
      state.value = 'chat';
      chatMode.value = 'global';
      statusMessage.value = 'Connected to Global Chat';
    };
    
    const enterDirectChat = () => {
      state.value = 'chat';
      chatMode.value = 'direct';
      statusMessage.value = 'Private Chat with Alexander';
    };
    
    const toggleChatMode = () => {
      if (chatMode.value === 'global') {
        chatMode.value = 'direct';
        statusMessage.value = 'Private Chat with Alexander';
      } else {
        chatMode.value = 'global';
        statusMessage.value = 'Connected to Global Chat';
      }
    };
    
    const simulateConnectingToRelays = () => {
      // Update relay connection status with artificial delays
      relays.value.forEach((relay, index) => {
        setTimeout(() => {
          relay.connected = true;
        }, 1000 + index * 500);
      });
    };
    
    const sendGlobalMessage = () => {
      if (!newMessage.value.trim()) return;
      
      // Add user message to global chat
      const userMessage = {
        id: Date.now().toString(),
        author: username.value,
        content: newMessage.value,
        timestamp: getTimeString(),
        own: true
      };
      
      globalMessages.value.push(userMessage);
      
      // Clear input
      const sentContent = newMessage.value;
      newMessage.value = '';
      statusMessage.value = 'Message sent to global chat';
      
      // Simulate responses from other users after a delay
      setTimeout(() => {
        const responseContent = getGlobalChatResponse(sentContent);
        globalMessages.value.push({
          id: (Date.now() + 1).toString(),
          author: getRandomUser(),
          content: responseContent,
          timestamp: getTimeString(),
          own: false
        });
      }, 2500 + Math.random() * 3000);
    };
    
    const sendDirectMessage = () => {
      if (!newDirectMessage.value.trim()) return;
      
      // Add user message to direct messages
      const userMessage = {
        id: Date.now().toString(),
        author: username.value,
        content: newDirectMessage.value,
        timestamp: getTimeString(),
        own: true
      };
      
      directMessages.value.push(userMessage);
      
      // Clear input
      const sentContent = newDirectMessage.value;
      newDirectMessage.value = '';
      statusMessage.value = 'Private message sent to Alexander';
      
      // Simulate response from Alexander after a delay
      setTimeout(() => {
        const responseContent = getAlexanderResponse(sentContent);
        directMessages.value.push({
          id: (Date.now() + 1).toString(),
          author: 'Alexander',
          content: responseContent,
          timestamp: getTimeString(),
          own: false
        });
      }, 2000 + Math.random() * 2000);
    };
    
    // Simple response generation for global chat
    const getGlobalChatResponse = (message) => {
      const responses = [
        "That's interesting! Anyone else have thoughts on this?",
        "I've been thinking about that too recently.",
        "Thanks for sharing that with the community.",
        "I totally agree with your point there.",
        "That's a unique perspective, I hadn't considered that.",
        "The Nostr protocol is perfect for discussions like this.",
        "This is why decentralized platforms are the future.",
        "Have you tried using NIP-07 extensions for that?",
        "That reminds me of something I read on another relay."
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    };
    
    // Simple response generation for Alexander
    const getAlexanderResponse = (message) => {
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return `Hello! Thanks for reaching out. How can I assist you with your project?`;
      } else if (lowerMsg.includes('help') || lowerMsg.includes('question')) {
        return `I'd be happy to help! Could you provide more details about what you're looking for?`;
      } else if (lowerMsg.includes('nostr')) {
        return `Nostr is a fascinating protocol that enables truly decentralized communication. I've integrated it into this site to demonstrate its capabilities. What aspects are you most interested in?`;
      } else if (lowerMsg.includes('project') || lowerMsg.includes('work')) {
        return `I'm always interested in discussing new projects. My expertise is in web development with a focus on decentralized technologies. Would you like to tell me more about what you have in mind?`;
      } else if (lowerMsg.includes('contact') || lowerMsg.includes('email')) {
        return `You've already found the best way to reach me! This Nostr-based messaging system ensures our communication is secure and decentralized. Feel free to share more details about your inquiry.`;
      } else {
        return `Thanks for your message. I appreciate you reaching out through this Nostr client. This demonstrates your interest in decentralized technologies, which is great! Please feel free to share more details about how I might be able to help you.`;
      }
    };
    
    const getRandomUser = () => {
      const users = ['bob21', 'alice', 'satoshi93', 'nostr_fan', 'damus_user', 'relay_admin', 'zap_enthusiast', 'lightning_node'];
      return users[Math.floor(Math.random() * users.length)];
    };
    
    const shortenKey = (key) => {
      if (!key) return '';
      return key.substring(0, 8) + '...' + key.substring(key.length - 4);
    };
    
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        statusMessage.value = 'Copied to clipboard!';
        setTimeout(() => {
          statusMessage.value = state.value === 'chat' ? 
            (chatMode.value === 'global' ? 'Connected to Global Chat' : 'Private Chat with Alexander') : 
            'Ready';
        }, 2000);
      });
    };
    
    const logOut = () => {
      state.value = 'login';
      statusMessage.value = 'Logged out';
      username.value = '';
      privateKey.value = '';
      publicKey.value = '';
      keyCreated.value = false;
      globalMessages.value = [];
      directMessages.value = [];
    };
    
    // Lifecycle hooks
    onMounted(() => {
      updateTime();
      clockTimer = setInterval(updateTime, 1000);
      simulateStartup();
      
      // Auto-login bei vorhandenen Umgebungsvariablen
      if (import.meta.env.VITE_NOSTR_USER_NAME && 
          import.meta.env.VITE_NOSTR_PRIVATE_KEY) {
        // Verzögerung für bessere UX - nach dem Startup
        setTimeout(() => {
          if (state.value === 'welcome' || state.value === 'login') {
            loadSimulatedAccount();
          }
        }, 2500); // Warte etwas nach dem Startup
      }
    });
    
    onUnmounted(() => {
      clearInterval(clockTimer);
    });
    
    return {
      state,
      chatMode,
      startupProgress,
      statusMessage,
      currentTime,
      username,
      publicKey,
      privateKey,
      keyCreated,
      alexanderPubkey,
      globalMessages,
      directMessages,
      newMessage,
      newDirectMessage,
      relays,
      connectedRelaysCount,
      createSimulatedAccount,
      loadSimulatedAccount,
      proceedToChat,
      enterGlobalChat,
      enterDirectChat,
      toggleChatMode,
      sendGlobalMessage,
      sendDirectMessage,
      shortenKey,
      copyToClipboard,
      logOut
    };
  }
};
</script>

<style scoped>
.amiga-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--window-gray);
  color: var(--text-dark);
  font-family: 'Topaz', 'Courier New', monospace;
  border: 1px solid var(--text-dark);
  overflow: hidden;
}

/* Rest of the styles same as NostrAmigaClient.vue */
.amiga-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--window-blue);
  color: white;
  padding: 2px 5px;
  height: 20px;
}

.amiga-buttons {
  display: flex;
  gap: 3px;
}

.amiga-button {
  width: 16px;
  height: 16px;
  background-color: var(--window-gray);
  border: 1px solid black;
  cursor: pointer;
}

.amiga-screen {
  flex: 1;
  background-color: var(--window-gray);
  padding: 10px;
  overflow-y: auto;
}

.amiga-statusbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--window-blue);
  color: white;
  padding: 3px 5px;
  font-size: 12px;
}

/* Startup screen */
.amiga-startup {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;
}

.amiga-logo {
  text-align: center;
}

.amiga-logo-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--window-blue);
}

.amiga-loading {
  margin-top: 20px;
}

.amiga-progress-bar {
  width: 100%;
  height: 20px;
  background-color: white;
  border: 1px solid var(--text-dark);
  margin-top: 10px;
}

.amiga-progress {
  height: 100%;
  background-color: var(--window-blue);
}

/* Login menu */
.amiga-login {
  text-align: center;
  padding: 20px;
}

.amiga-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
  margin: 20px auto;
}

.amiga-menu-item {
  padding: 8px;
  background-color: white;
  border: 2px solid var(--text-dark);
  color: var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
  font-size: 14px;
}

.amiga-menu-item:hover {
  background-color: var(--window-blue);
  color: white;
}

/* Form styles */
.amiga-form {
  background-color: white;
  border: 1px solid var(--text-dark);
  padding: 15px;
  margin: 20px auto;
  max-width: 450px;
}

.amiga-form-group {
  margin-bottom: 15px;
}

.amiga-form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.amiga-input {
  width: 100%;
  padding: 5px;
  border: 1px solid var(--text-dark);
  background-color: white;
  font-family: 'Topaz', 'Courier New', monospace;
}

.amiga-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.amiga-button-primary {
  padding: 5px 15px;
  background-color: var(--window-blue);
  color: white;
  border: 2px solid var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
}

.amiga-button-secondary {
  padding: 5px 15px;
  background-color: var(--window-gray);
  color: var(--text-dark);
  border: 2px solid var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
}

/* Key display */
.amiga-key-result {
  background-color: white;
  border: 1px solid var(--text-dark);
  padding: 15px;
  margin: 20px auto;
  max-width: 450px;
}

.amiga-key-display {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  font-family: monospace;
  word-break: break-all;
}

.amiga-warning {
  color: red;
  font-weight: bold;
  margin: 15px 0;
}

/* Chat screen */
.amiga-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.amiga-chat-info {
  background-color: white;
  border: 1px solid var(--text-dark);
  padding: 10px;
  margin-bottom: 10px;
}

.amiga-relay-status {
  font-size: 12px;
  margin-top: 10px;
}

.amiga-relay-status ul {
  list-style-type: none;
  padding-left: 0;
}

.amiga-relay-status li {
  padding: 2px 0;
}

.amiga-relay-status li.connected {
  color: green;
}

.amiga-messages {
  flex: 1;
  background-color: white;
  border: 1px solid var(--text-dark);
  padding: 10px;
  margin-bottom: 10px;
  overflow-y: auto;
  max-height: 300px;
}

.amiga-message {
  margin-bottom: 10px;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.own-message {
  background-color: #e0f0ff;
}

.amiga-chat-input {
  display: flex;
  gap: 10px;
}

.amiga-chat-input .amiga-input {
  flex: 1;
}

/* New styles for enhanced UI */

/* Welcome and Information Screen */
.amiga-welcome, .amiga-info-box {
  padding: 15px;
  text-align: center;
}

.amiga-info-box {
  background-color: white;
  border: 1px solid var(--text-dark);
  padding: 15px;
  margin: 15px auto;
  max-width: 80%;
  text-align: left;
  line-height: 1.5;
}

.amiga-info-box.small {
  margin: 10px auto;
  padding: 10px;
  font-size: 0.9em;
}

.amiga-button-row {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Chat Hub Styles */
.amiga-chat-hub {
  padding: 15px;
  text-align: center;
}

.amiga-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 80%;
  max-width: 500px;
  margin: 20px auto;
}

.amiga-menu-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  border: 2px solid var(--text-dark);
  color: var(--text-dark);
  cursor: pointer;
  font-family: 'Topaz', 'Courier New', monospace;
  text-align: left;
}

.amiga-menu-item.secondary {
  background-color: var(--window-gray);
}

.amiga-menu-item:hover {
  background-color: var(--window-blue);
  color: white;
}

.menu-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  background-color: var(--window-blue);
  display: flex;
  justify-content: center;
}
</style>
