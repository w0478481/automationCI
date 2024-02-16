const clientIO = require('socket.io-client');

describe('Server Testing', () => {
    let socket;

    // Setup a socket connection before each test
    beforeEach((done) => {
        // Connect to the server
        socket = clientIO.connect('http://localhost:3000');

        // Handle connection
        socket.on('connect', () => {
            done();
        });

        // Handle errors
        socket.on('error', (error) => {
            done(error);
        });
    });

      // Disconnect the socket after each test
      afterEach((done) => {
        if (socket.connected) {
            socket.disconnect();
        }
        done();
    });

    // Test case to check if the server sends the current times
    test('should receive the current server time from the server', (done) => {
        socket.on('server_time', (timeString) => {
            expect(timeString).toMatch(/[0-9]{2}:[0-9]{2}:[0-9]{2}/); // Matches HH:MM:SS format
            done();
        });
    });

    // Test case to check if the server sends the count of connected clients
    test('should receive the count of connected clients from the server', (done) => {
        socket.on('count', (count) => {
            expect(count).toBeGreaterThanOrEqual(0); // Count should be non-negative
            done();
        });
    });

     // Test sending and receiving messages
  test('Send and receive messages', (done) => {
    const messageToSend = 'Hello, world!';
    
    // Listen for new messages
    socket.on('new_message', (receivedMessage) => {
      // Check if the received message matches the sent message
      expect(receivedMessage).toBe(messageToSend);
      done(); // Signal that the test is complete
    });

    // Send a message
    socket.emit('message', messageToSend);
  });

  
});


