const services = [
    {
        title: "API Development & APIs Integration",
        description: "Designing and building robust, scalable RESTful APIs and GraphQL endpoints. Seamlessly integrating third-party services and payment gateways to power web and mobile applications.",
        icon: "Server",
        highlight: "High-performance systems",
        features: ["REST & GraphQL APIs", "Microservices Architecture", "Third-party Integrations", "Real-time WebSockets"],
        stats: [
            { label: "Uptime", value: "99.9%" },
            { label: "Scalability", value: "High" },
            { label: "Latency", value: "<50ms" }
        ]
    },
    {
        title: "Database Design & Optimization",
        description: "Architecting optimized database schemas for both SQL and NoSQL databases. Guaranteeing data integrity, fast query performance, and reliable storage solutions for scalable apps.",
        icon: "Database",
        highlight: "Optimized data storage",
        features: ["MongoDB & PostgreSQL", "Schema Optimization", "Data Migration", "Caching Strategies (Redis)"],
        stats: [
            { label: "Integrity", value: "100%" },
            { label: "Queries", value: "Optimized" },
            { label: "Security", value: "Max" }
        ]
    },
    {
        title: "System Performance & Security",
        description: "Implementing strong security measures, authentication (JWT/OAuth), and authorization protocols. Profiling and optimizing Node.js applications to reduce latency and handle high traffic.",
        icon: "ShieldCheck",
        highlight: "Secure & Fast execution",
        features: ["JWT Authentication", "Role-Based Access", "Performance Profiling", "Load Balancing"],
        stats: [
            { label: "Security", value: "A+" },
            { label: "Auth", value: "OAuth2/JWT" },
            { label: "Performance", value: "Maximized" }
        ]
    }
];

async function seed() {
    for (const s of services) {
        const res = await fetch('http://localhost:5173/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s)
        });
        console.log(await res.json());
    }
}

seed();
