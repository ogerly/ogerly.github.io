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
      
      <!-- Login Screen -->
      <div v-else-if="state === 'login'" class="amiga-login">
        <h2>Welcome to NostrOS 1.3</h2>
        <div class="amiga-menu">
          <button @click="state = 'create'" class="amiga-menu-item">Create New Account</button>
          <button @click="state = 'load'" class="amiga-menu-item">Load Existing Account</button>
        </div>
      </div>
      
      <!-- Create Account Screen -->
      <div v-else-if="state === 'create'" class="amiga-create">
        <h2>Create New Account</h2>
        <div class="amiga-form">
          <div class="amiga-form-group">
            <label>Username:</label>
            <input v-model="username" type="text" class="amiga-input" />
          </div>
          <div class="amiga-actions">
            <button @click="createAccount" class="amiga-button-primary">Generate Keys</button>
            <button @click="state = 'login'" class="amiga-button-secondary">Back</button>
          </div>
        </div>
        
        <div v-if="keyCreated" class="amiga-key-result">
          <p>Your keys have been generated:</p>
          <div class="amiga-key-display">
            <p><strong>Public Key:</strong> {{ publicKey }}</p>
            <p><strong>Private Key:</strong> {{ privateKey }}</p>
          </div>
          <p class="amiga-warning">⚠️ IMPORTANT: Save your private key securely! It cannot be recovered if lost.</p>
          <button @click="proceedToChat" class="amiga-button-primary">Enter Chat</button>
        </div>
      </div>
      
      <!-- Load Account Screen -->
      <div v-else-if="state === 'load'" class="amiga-load">
        <h2>Load Existing Account</h2>
        <div class="amiga-form">
          <div class="amiga-form-group">
            <label>Username:</label>
            <input v-model="username" type="text" class="amiga-input" />
          </div>
          <div class="amiga-form-group">
            <label>Private Key:</label>
            <input v-model="privateKey" type="password" class="amiga-input" />
          </div>
          <div class="amiga-actions">
            <button @click="loadAccount" class="amiga-button-primary">Login</button>
            <button @click="state = 'login'" class="amiga-button-secondary">Back</button>
          </div>
        </div>
      </div>
      
      <!-- Chat Screen -->
      <div v-else-if="state === 'chat'" class="amiga-chat">
        <div class="amiga-chat-info">
          <h2>NostrOS Chat</h2>
          <p>Connected as: {{ username }}</p>
          <div class="amiga-relay-status">
            <p>Connected Relays:</p>
            <ul>
              <li v-for="(relay, index) in relays" :key="index" :class="{ 'connected': relay.connected }">
                {{ relay.url }} - {{ relay.connected ? 'Connected' : 'Connecting...' }}
              </li>
            </ul>
          </div>
        </div>
        
        <div class="amiga-messages">
          <div v-for="(message, index) in messages" :key="index" class="amiga-message" :class="{ 'own-message': message.own }">
            <div class="message-header">
              <strong>{{ message.author }}</strong>
              <span>{{ formatTime(message.timestamp) }}</span>
            </div>
            <p>{{ message.content }}</p>
          </div>
        </div>
        
        <div class="amiga-chat-input">
          <input v-model="newMessage" type="text" class="amiga-input" placeholder="Type your message..." @keyup.enter="sendMessage" />
          <button @click="sendMessage" class="amiga-button-primary">Send</button>
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
import * as nostrTools from 'nostr-tools'; // We need to ensure this dependency is installed

export default {
  name: 'NostrAmigaClient',
  setup() {
    // App state
    const state = ref('startup');
    const startupProgress = ref(0);
    const statusMessage = ref('Booting NostrOS 1.3...');
    const currentTime = ref('');
    
    // User data
    const username = ref('');
    const publicKey = ref('');
    const privateKey = ref('');
    const keyCreated = ref(false);
    
    // Chat data
    const messages = ref([]);
    const newMessage = ref('');
    
    // Default relays - these are some commonly used Nostr relays
    const relays = ref([
      { url: 'wss://relay.damus.io', connected: false },
      { url: 'wss://relay.nostr.info', connected: false },
      { url: 'wss://nostr-pub.wellorder.net', connected: false },
      { url: 'wss://nostr.fmt.wiz.biz', connected: false },
      { url: 'wss://relay.nostr.band', connected: false }
    ]);
    
    // Nostr connection objects
    const pool = ref(null);
    const subscription = ref(null);
    
    // Timer for updating current time
    let clockTimer = null;
    
    // Methods
    const updateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString();
    };
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString();
    };
    
    const simulateStartup = () => {
      const interval = setInterval(() => {
        startupProgress.value += 5;
        if (startupProgress.value >= 100) {
          clearInterval(interval);
          state.value = 'login';
          statusMessage.value = 'Ready';
        }
      }, 200);
    };
    
    const createAccount = () => {
      if (!username.value) {
        statusMessage.value = 'Error: Username required';
        return;
      }
      
      try {
        // Generate a new key pair
        const sk = nostrTools.generatePrivateKey();
        privateKey.value = sk;
        publicKey.value = nostrTools.getPublicKey(sk);
        keyCreated.value = true;
        statusMessage.value = 'Keys generated successfully';
      } catch (error) {
        console.error('Error generating keys:', error);
        statusMessage.value = 'Error generating keys';
      }
    };
    
    const loadAccount = () => {
      if (!username.value || !privateKey.value) {
        statusMessage.value = 'Error: Username and private key required';
        return;
      }
      
      try {
        // Validate the private key
        publicKey.value = nostrTools.getPublicKey(privateKey.value);
        proceedToChat();
      } catch (error) {
        console.error('Error loading account:', error);
        statusMessage.value = 'Error: Invalid private key';
      }
    };
    
    const proceedToChat = () => {
      state.value = 'chat';
      statusMessage.value = 'Connecting to relays...';
      connectToRelays();
    };
    
    const connectToRelays = () => {
      try {
        // Create a new relay pool
        pool.value = new nostrTools.SimplePool();
        
        // Connect to each relay
        const relayUrls = relays.value.map(relay => relay.url);
        
        // Subscribe to events
        subscription.value = pool.value.sub(relayUrls, [
          {
            kinds: [1], // Regular text notes
            limit: 20
          }
        ]);
        
        subscription.value.on('event', event => {
          // Add the new message to our list
          messages.value.push({
            id: event.id,
            author: event.pubkey === publicKey.value ? username.value : shortenKey(event.pubkey),
            content: event.content,
            timestamp: event.created_at,
            own: event.pubkey === publicKey.value
          });
          
          // Sort messages by timestamp
          messages.value.sort((a, b) => a.timestamp - b.timestamp);
        });
        
        // Update relay connection status
        relayUrls.forEach((url, index) => {
          setTimeout(() => {
            relays.value[index].connected = true;
          }, 1000 + index * 500); // Simulate connection delays
        });
        
        statusMessage.value = 'Connected to relays';
      } catch (error) {
        console.error('Error connecting to relays:', error);
        statusMessage.value = 'Error connecting to relays';
      }
    };
    
    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;
      
      try {
        // Create a Nostr event
        const event = {
          kind: 1,
          pubkey: publicKey.value,
          created_at: Math.floor(Date.now() / 1000),
          tags: [],
          content: newMessage.value
        };
        
        // Sign the event
        event.id = nostrTools.getEventHash(event);
        event.sig = nostrTools.signEvent(event, privateKey.value);
        
        // Publish to all relays
        const relayUrls = relays.value.map(relay => relay.url);
        const pubs = pool.value.publish(relayUrls, event);
        
        // Add message to the list
        messages.value.push({
          id: event.id,
          author: username.value,
          content: event.content,
          timestamp: event.created_at,
          own: true
        });
        
        newMessage.value = '';
        statusMessage.value = 'Message sent';
      } catch (error) {
        console.error('Error sending message:', error);
        statusMessage.value = 'Error sending message';
      }
    };
    
    const shortenKey = (key) => {
      return key.substring(0, 8) + '...' + key.substring(key.length - 4);
    };
    
    // Lifecycle hooks
    onMounted(() => {
      updateTime();
      clockTimer = setInterval(updateTime, 1000);
      simulateStartup();
    });
    
    onUnmounted(() => {
      clearInterval(clockTimer);
      if (subscription.value) {
        subscription.value.unsub();
      }
      if (pool.value) {
        pool.value.close();
      }
    });
    
    return {
      state,
      startupProgress,
      statusMessage,
      currentTime,
      username,
      publicKey,
      privateKey,
      keyCreated,
      messages,
      newMessage,
      relays,
      createAccount,
      loadAccount,
      proceedToChat,
      sendMessage,
      formatTime
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
</style>
