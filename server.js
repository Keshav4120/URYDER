const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Track active partners and their rooms
  const activePartners = new Map();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room based on role or user ID
    socket.on('join', (data) => {
      socket.join(data.userId);
      if (data.role === 'partner') {
        activePartners.set(socket.id, data.userId);
        console.log(`Partner ${data.userId} is now online`);
      }
    });

    // Handle location updates from partners
    socket.on('update-location', (data) => {
      // Broadcast location to users in the same area or just update DB
      // For now, we'll just log it. The client will also call the API.
      console.log(`Location update from ${data.userId}:`, data.lat, data.lng);
      
      // Emit to a general "tracking" room if needed, or specific users
      io.emit('partner-location-updated', {
        partnerId: data.userId,
        lat: data.lat,
        lng: data.lng,
        vehicleType: data.vehicleType
      });
    });

    // Handle new booking requests
    socket.on('new-booking', (data) => {
      console.log('New booking request received:', data.booking._id);
      // Broadcast to all (for simplicity now, or filter by location/type)
      io.emit('new-booking-received', data);
    });

    socket.on('accept-booking', (data) => {
      console.log('Booking accepted:', data.bookingId);
      // Notify the user that their booking has been accepted
      io.to(data.userId).emit('booking-accepted', data);
    });

    socket.on('update-booking-status', (data) => {
      console.log('Booking status updated:', data.bookingId, data.status);
      // Notify the user about the status change (ongoing, completed, etc.)
      io.to(data.userId).emit('booking-status-changed', data);
    });

    socket.on('disconnect', () => {
      activePartners.delete(socket.id);
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
