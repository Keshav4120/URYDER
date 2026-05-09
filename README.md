<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>URYDER - GitHub Description</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-text {
            background: linear-gradient(90deg, #3b82f6, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
</head>
<body class="bg-[#0a0a0a] text-gray-300 min-h-screen py-20 px-6">
    <div class="max-w-4xl mx-auto border border-white/10 bg-[#111] rounded-[40px] p-8 md:p-16 shadow-2xl">
        <!-- Header -->
        <header class="text-center mb-16">
            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">
                🚀 URYDER
            </h1>
            <p class="text-xl md:text-2xl font-bold gradient-text mb-8">
                Smart Real-Time Mobility Ecosystem
            </p>
            <p class="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                URYDER is an enterprise-grade ride-sharing platform engineered for high-performance geospatial tracking and real-time state synchronization.
            </p>
        </header>
        <section class="mb-16">
            <h2 class="text-xs font-black uppercase tracking-[0.4em] text-blue-500 mb-8 border-b border-white/5 pb-4">
                Technical Stack
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <p class="text-white font-bold text-sm">Next.js 15</p>
                    <p class="text-[10px] text-gray-500 uppercase">Frontend Framework</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <p class="text-white font-bold text-sm">Socket.io</p>
                    <p class="text-[10px] text-gray-500 uppercase">Real-Time Engine</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <p class="text-white font-bold text-sm">MongoDB</p>
                    <p class="text-[10px] text-gray-500 uppercase">NoSQL Database</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <p class="text-white font-bold text-sm">TypeScript</p>
                    <p class="text-[10px] text-gray-500 uppercase">Type Safety</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <p class="text-white font-bold text-sm">Razorpay</p>
                    <p class="text-[10px] text-gray-500 uppercase">Payment Gateway</p>
                </div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <p class="text-white font-bold text-sm">Tailwind CSS</p>
                    <p class="text-[10px] text-gray-500 uppercase">UI/UX Styling</p>
                </div>
            </div>
        </section>
        <section class="mb-16">
            <h2 class="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-8 border-b border-white/5 pb-4">
                Core Capabilities
            </h2>
            <ul class="space-y-6">
                <li class="flex gap-4">
                    <span class="text-emerald-500 font-black">✔</span>
                    <div>
                        <h3 class="text-white font-bold">Real-Time State Sync</h3>
                        <p class="text-sm text-gray-500">WebSocket-driven communication for instantaneous booking requests and tracking.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="text-emerald-500 font-black">✔</span>
                    <div>
                        <h3 class="text-white font-bold">Live Geospatial Tracking</h3>
                        <p class="text-sm text-gray-500">Integrated Google Maps routing with dynamic polyline updates for active trips.</p>
                    </div>
                </li>
                <li class="flex gap-4">
                    <span class="text-emerald-500 font-black">✔</span>
                    <div>
                        <h3 class="text-white font-bold">Automated Onboarding</h3>
                        <p class="text-sm text-gray-500">KYC-driven partner verification with secure document handling and vehicle approval.</p>
                    </div>
                </li>
            </ul>
        </section>
        <section class="mb-16">
            <h2 class="text-xs font-black uppercase tracking-[0.4em] text-orange-500 mb-8 border-b border-white/5 pb-4">
                Engineering Excellence
            </h2>
            <p class="text-sm leading-relaxed text-gray-400">
                URYDER utilizes a decoupled architecture where the socket server manages thousands of concurrent connections independently of the main API. The database is modeled for high read/write efficiency, ensuring that trip states are consistent across user and partner dashboards.
            </p>
        </section>
        <footer class="text-center pt-8 border-t border-white/5">
            <p class="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
                Created by Keshav Jindal &copy; 2026
            </p>
        </footer>
    </div>
</body>
</html>
