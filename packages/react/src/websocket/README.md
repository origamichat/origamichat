# WebSocket Implementation

This module provides a comprehensive, type-safe WebSocket solution for real-time communication in the Cossistant support platform.

## Features

- **Type Safety**: Full TypeScript support with Zod schemas for message validation
- **Automatic Reconnection**: Exponential backoff strategy with configurable parameters
- **Message Queuing**: Offline message support with automatic retry
- **Real-time Typing**: Support for typing indicators and live typing progress
- **Subscription Management**: Easy conversation and website subscription handling
- **Connection Health**: Built-in monitoring and statistics
- **React Integration**: Hooks and Context API for seamless React usage

## Quick Start

### 1. Provider Setup

Wrap your application with the WebSocket provider:

```tsx
import { WebSocketProvider } from "@cossistant/react/websocket";

function App() {
  return (
    <WebSocketProvider
      config={{
        url: "wss://api.cossistant.com/ws",
        autoReconnect: true,
        debug: process.env.NODE_ENV === "development",
      }}
      handlers={{
        onNewMessage: (message) => {
          console.log("New message:", message);
        },
        onTypingProgress: (message) => {
          console.log("Live typing:", message.content);
        },
      }}
    >
      <YourApp />
    </WebSocketProvider>
  );
}
```

### 2. Using the Hook

```tsx
import { useWebSocket } from "@cossistant/react/websocket";

function ChatComponent() {
  const {
    isConnected,
    subscribeToConversation,
    sendChatMessage,
    sendTypingProgress,
    startTyping,
    stopTyping,
  } = useWebSocket();

  const conversationId = "conv-123";

  // Subscribe to conversation
  useEffect(() => {
    if (isConnected) {
      subscribeToConversation(conversationId);
    }
  }, [isConnected, conversationId]);

  // Send a message
  const handleSend = (text: string) => {
    sendChatMessage(conversationId, { text });
  };

  // Handle typing
  const handleTyping = (content: string) => {
    if (content) {
      sendTypingProgress(conversationId, content);
    }
  };

  return (
    <div>
      <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>
      <input
        onFocus={() => startTyping(conversationId)}
        onBlur={() => stopTyping(conversationId)}
        onChange={(e) => handleTyping(e.target.value)}
      />
    </div>
  );
}
```

## Configuration

### WebSocketConfig

```tsx
interface WebSocketConfig {
  url?: string;                    // WebSocket URL
  autoReconnect?: boolean;         // Enable auto-reconnect (default: true)
  reconnectDelay?: number;         // Initial delay in ms (default: 1000)
  maxReconnectDelay?: number;      // Max delay in ms (default: 30000)
  reconnectDelayMultiplier?: number; // Backoff multiplier (default: 1.5)
  maxReconnectAttempts?: number;   // Max attempts (default: Infinity)
  enableMessageQueue?: boolean;    // Enable offline queuing (default: true)
  maxQueueSize?: number;          // Max queue size (default: 100)
  heartbeatInterval?: number;      // Ping interval in ms (default: 30000)
  requestTimeout?: number;         // Request timeout in ms (default: 10000)
  debug?: boolean;                // Enable debug logging (default: false)
  headers?: Record<string, string>; // Custom headers
  protocols?: string | string[];   // WebSocket protocols
  typingProgressThrottle?: number; // Typing throttle in ms (default: 100)
}
```

## Message Types

### Client Messages

```tsx
// Subscribe to conversation
{ type: "subscribe_conversation", conversationId: "conv-123" }

// Subscribe to website (team members only)
{ type: "subscribe_website", websiteId: "site-456" }

// Typing indicators
{ type: "typing_start", conversationId: "conv-123" }
{ type: "typing_stop", conversationId: "conv-123" }

// Live typing progress
{ type: "typing_progress", conversationId: "conv-123", content: "Hello..." }

// Send message
{ 
  type: "send_message", 
  conversationId: "conv-123", 
  content: { text: "Hello!" }
}
```

### Server Messages

```tsx
// New message received
{
  type: "new_message",
  conversationId: "conv-123",
  messageId: "msg-789",
  content: { text: "Hello!" },
  senderType: "visitor" | "user" | "ai_agent",
  senderId: "user-456",
  // ...
}

// Typing progress from other users
{
  type: "typing_progress",
  conversationId: "conv-123",
  userId: "user-456",
  userType: "visitor",
  content: "Hello there...",
  // ...
}

// Connection established
{
  type: "connection_established",
  connectionId: "conn-123",
  serverTime: 1704067200000
}
```

## Advanced Usage

### Direct Hook Usage (without provider)

```tsx
import { useWebSocketDirect } from "@cossistant/react/websocket";

function StandaloneComponent() {
  const websocket = useWebSocketDirect({
    config: {
      url: "wss://api.example.com/ws",
      autoReconnect: true,
    },
    handlers: {
      onNewMessage: (message) => {
        console.log("New message:", message);
      },
    },
  });

  return (
    <div>
      Connection: {websocket.isConnected ? "Connected" : "Disconnected"}
    </div>
  );
}
```

### Connection Health Monitoring

```tsx
function ConnectionMonitor() {
  const { stats, isConnected } = useWebSocket();

  return (
    <div>
      <div>Connected: {isConnected ? "Yes" : "No"}</div>
      <div>Messages Sent: {stats.messagesSent}</div>
      <div>Messages Received: {stats.messagesReceived}</div>
      <div>Reconnect Attempts: {stats.reconnectAttempts}</div>
      {stats.lastError && (
        <div>Last Error: {stats.lastError}</div>
      )}
    </div>
  );
}
```

### Custom Event Handlers

```tsx
const eventHandlers: WebSocketEventHandlers = {
  onOpen: (event) => {
    console.log("WebSocket opened");
  },
  onClose: (event) => {
    console.log("WebSocket closed:", event.code, event.reason);
  },
  onError: (event) => {
    console.error("WebSocket error:", event);
  },
  onMessage: (message) => {
    console.log("Raw message:", message);
  },
  onNewMessage: (message) => {
    // Handle new chat messages
    console.log("New message:", message);
  },
  onTypingProgress: (message) => {
    // Handle live typing updates
    console.log("Typing progress:", message.content);
  },
  onTypingIndicator: (message) => {
    // Handle typing start/stop
    console.log("Typing indicator:", message.isTyping);
  },
  onConversationStatusChange: (message) => {
    // Handle conversation status changes
    console.log("Status changed:", message.status);
  },
  onVisitorPresence: (message) => {
    // Handle visitor online/offline
    console.log("Visitor presence:", message.type);
  },
  onReconnectAttempt: (attemptNumber) => {
    console.log("Reconnect attempt:", attemptNumber);
  },
  onReconnectSuccess: () => {
    console.log("Reconnected successfully");
  },
  onReconnectFail: () => {
    console.log("Failed to reconnect");
  },
};
```

## Use Cases

### 1. Support Dashboard

For support agents to monitor multiple conversations:

```tsx
function SupportDashboard() {
  const websocket = useWebSocket();
  const [conversations, setConversations] = useState([]);
  const [typingPreviews, setTypingPreviews] = useState({});

  useEffect(() => {
    if (websocket.isConnected) {
      // Subscribe to entire website
      websocket.subscribeToWebsite("website-123");
    }
  }, [websocket.isConnected]);

  const handleTypingProgress = (message) => {
    if (message.userType === "visitor") {
      setTypingPreviews(prev => ({
        ...prev,
        [message.conversationId]: message.content
      }));
    }
  };

  return (
    <div>
      {conversations.map(conv => (
        <div key={conv.id}>
          <h3>Conversation {conv.id}</h3>
          {typingPreviews[conv.id] && (
            <div>Visitor typing: "{typingPreviews[conv.id]}"</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 2. Chat Widget

For website visitors:

```tsx
function ChatWidget() {
  const websocket = useWebSocket();
  const [conversationId] = useState("visitor-conv-456");

  useEffect(() => {
    if (websocket.isConnected) {
      websocket.subscribeToConversation(conversationId);
    }
  }, [websocket.isConnected, conversationId]);

  const handleMessageSend = (text) => {
    websocket.sendChatMessage(conversationId, { text });
  };

  return (
    <div>
      <MessageList />
      <MessageInput onSend={handleMessageSend} />
    </div>
  );
}
```

## Best Practices

1. **Connection Management**: Always check `isConnected` before sending messages
2. **Subscription Cleanup**: Unsubscribe when components unmount
3. **Error Handling**: Implement proper error handling for connection failures
4. **Performance**: Use message queuing for offline scenarios
5. **Debugging**: Enable debug mode during development
6. **Throttling**: Use built-in throttling for typing progress updates

## Troubleshooting

### Common Issues

1. **Connection Failures**: Check WebSocket URL and authentication
2. **Message Not Received**: Verify subscription to correct channels
3. **Reconnection Issues**: Adjust reconnection parameters
4. **Performance**: Monitor queue size and message frequency

### Debug Mode

Enable debug logging to troubleshoot issues:

```tsx
<WebSocketProvider
  config={{
    debug: true,
    // ... other config
  }}
>
  <App />
</WebSocketProvider>
```

This will log all WebSocket activities to the console.

## API Reference

### Hooks

- `useWebSocket()`: Main hook for WebSocket functionality (requires provider)
- `useWebSocketDirect(options)`: Direct hook usage without provider
- `useAdvancedWebSocket(config, handlers)`: Low-level hook

### Components

- `WebSocketProvider`: Context provider for WebSocket functionality

### Types

- `WebSocketConfig`: Configuration options
- `WebSocketEventHandlers`: Event handler interface
- `ClientMessages`: Union of all client message types
- `ServerMessages`: Union of all server message types
- `MessageContent`: Message content structure
- `UseAdvancedWebSocketReturn`: Hook return type