import Stomp from "stompjs";
import { httpClient } from "../httpClient";

let stompClient = null;
let reconnectTimeout = null;

// 웹소켓 URL 설정
const LOCAL_WS_URL = "ws://localhost:8080";
const PROD_WS_URL = "ws://52.78.43.93:8000";

// 배포, 로컬 주석으로 사용
const WS_URL = PROD_WS_URL; // 배포
// const WS_URL = LOCAL_WS_URL; // 로컬

export const connectWebSocket = (onConnected, onError) => {
  const token = localStorage.getItem("accessToken");

  // 토큰을 URL 쿼리 파라미터로 추가
  const socket = new WebSocket(`${WS_URL}/ws?token=${encodeURIComponent(token)}`);

  const stompConfig = {
    debug: function (str) {
      console.log("STOMP: " + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  };

  stompClient = Stomp.over(socket);
  Object.assign(stompClient, stompConfig);

  stompClient.connect(
    {},
    (frame) => {
      console.log("Connected:", frame);
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      onConnected();
    },
    (error) => {
      console.error("STOMP Error:", error);
      onError(error);
      attemptReconnect(onConnected, onError);
    }
  );

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
    onError(error);
    attemptReconnect(onConnected, onError);
  };
};

const attemptReconnect = (onConnected, onError) => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  reconnectTimeout = setTimeout(() => {
    console.log("Attempting to reconnect...");
    connectWebSocket(onConnected, onError);
  }, 5000);
};

export const subscribeToChannel = (channelId, onMessageReceived) => {
  if (stompClient && stompClient.connected) {
    console.log(`Subscribing to channel: ${channelId}`);
    return stompClient.subscribe(`/topic/channel/${channelId}`, (message) => {
      console.log("Raw message received:", message);
      try {
        // JSON 형식의 메시지만 파싱 시도
        if (message.body && message.body.startsWith("{") && message.body.endsWith("}")) {
          const receivedMessage = JSON.parse(message.body);
          console.log("Parsed message:", receivedMessage);

          // Store the receivedMessage in localStorage
          localStorage.setItem("lastReceivedMessage", JSON.stringify(receivedMessage));

          onMessageReceived(receivedMessage);
        } else {
          // JSON이 아닌 메시지 처리 (예: 텍스트 메시지)
          console.log("Non-JSON message received:", message.body);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  } else {
    console.error("WebSocket is not connected");
    return null;
  }
};

export const sendMessage = (channelId, content, senderId, senderName) => {
  if (stompClient && stompClient.connected) {
    stompClient.send(
      "/app/chat/sendMessage",
      {},
      JSON.stringify({
        channelId: channelId.toString(),
        content,
        senderId,
        senderName,
        type: "CHAT",
      })
    );
  } else {
    console.error("WebSocket is not connected");
  }
};

export const sendMessageAndGetId = (channelId, messageContent, senderId, senderName) => {
  return new Promise((resolve, reject) => {
    if (stompClient && stompClient.connected) {
      const chatMessage = {
        channelId,
        content: messageContent.toString(),
        senderId,
        senderName,
        type: "CHAT",
      };

      const subscription = stompClient.subscribe("/user/queue/reply", (response) => {
        console.log("Raw response received:", response);
        try {
          console.log("Raw response:", response.body);
          const messageId = JSON.parse(response.body);
          console.log("Received messageId:", messageId);
          subscription.unsubscribe();
          resolve({ data: { messageId } });
        } catch (error) {
          console.error("Error parsing messageId:", error);
          reject("Failed to parse messageId");
        }
      });

      stompClient.send("/app/chat/sendMessage", {}, JSON.stringify(chatMessage));
    } else {
      reject("웹소켓이 연결되지 않았습니다.");
    }
  });
};

export const joinChannel = (channelId) => {
  if (stompClient && stompClient.connected) {
    stompClient.send("/app/chat/joinChannel", {}, JSON.stringify({ channelId }));
  } else {
    console.error("웹소켓이 연결되지 않았습니다.");
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect();
    stompClient = null;
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
};

// 채널 관련 HTTP 요청
export const getChannels = (serverId) => {
  return httpClient.get(`/api/channels/server/${serverId}`);
};

export const getRecentMessages = (channelId) => {
  return httpClient.get(`/api/chat/${channelId}/recent`);
};

export const getAllMessages = (channelId) => {
  return httpClient.get(`/api/chat/${channelId}/all`);
};

export const getUserMessages = (channelId, senderId) => {
  return httpClient.get(`/api/chat/${channelId}/user/${senderId}`);
};

export const updateMessage = (channelId, messageId, newContent) => {
  return httpClient.put(`/api/chat/${channelId}/${messageId}`, newContent);
};

export const deleteMessage = (channelId, messageId) => {
  return httpClient.delete(`/api/chat/${channelId}/${messageId}`);
};
