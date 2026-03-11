import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image, Text, useCursor, ScrollControls, useScroll, Html } from "@react-three/drei";
import * as THREE from "three";
import { useSpring, animated, config } from "@react-spring/three";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

// --- Dummy Data ---
const PROJECTS = [
    { id: 1, title: "Neon Commerce", category: "fullstack", image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80", description: "Next.js e-commerce platform with 3D product previews.", tech: ["Next.js", "Three.js", "Stripe"] },
    { id: 2, title: "Cyber Dashboard", category: "frontend", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", description: "Real-time data visualization dashboard for IoT devices.", tech: ["React", "D3.js", "WebSockets"] },
    { id: 3, title: "AI Chatbot", category: "backend", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80", description: "Context-aware chatbot using OpenAI API and Python.", tech: ["Python", "FastAPI", "OpenAI"] },
    { id: 4, title: "Portfolio V1", category: "frontend", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", description: "My previous portfolio site built with Gatsby.", tech: ["Gatsby", "GraphQL"] },
    { id: 5, title: "Task Master", category: "fullstack", image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80", description: "Collaborative task management tool.", tech: ["Vue", "Firebase"] },
    { id: 6, title: "Crypto Tracker", category: "frontend", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80", description: "Live cryptocurrency price tracker.", tech: ["React", "CoinGecko API"] },
];

const ProjectCard = ({ project, index, position, onClick, isActive }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    useCursor(hovered);

    // Spring animation for hover/active state
    const { scale, rotationY, positionZ } = useSpring({
        scale: isActive ? 1.5 : hovered ? 1.1 : 1,
        rotationY: isActive ? Math.PI : 0, // Flip card if active (optional, or just expand)
        positionZ: isActive ? 2 : hovered ? 0.5 : 0,
        config: config.wobbly
    });

    return (
        <animated.group position={[position[0], position[1], position[2]]}>
            <animated.mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onClick(project); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                scale={scale}
                position-z={positionZ}
            >
                <planeGeometry args={[3, 2]} />
                <meshPhysicalMaterial
                    color={hovered || isActive ? "#ffffff" : "#e0e0e0"}
                    transparent
                    opacity={isActive ? 1 : 0.8}
                    roughness={0.2}
                    metalness={0.1}
                    transmission={0.5}
                    thickness={1}
                />

                {/* Image Texture */}
                <Image
                    url={project.image}
                    scale={[2.8, 1.8]}
                    position={[0, 0, 0.01]}
                    transparent
                    opacity={isActive ? 0.3 : 1} // Fade image when active to show details if overlaying
                />

                {/* Text Overlay (Visible on Hover/Active) */}
                {(hovered || isActive) && (
                    <group position={[0, 0, 0.1]}>
                        <Text
                            position={[0, -0.8, 0]}
                            fontSize={0.15}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                            maxWidth={2.5}
                        >
                            {project.title}
                        </Text>
                    </group>
                )}
            </animated.mesh>
        </animated.group>
    );
};

const Grid = ({ projects, onSelect, activeProject }: any) => {
    const { width } = useThree((state) => state.viewport);
    const scroll = useScroll();
    const groupRef = useRef<THREE.Group>(null);

    // Responsive Grid Layout
    const columns = width > 10 ? 3 : width > 6 ? 2 : 1;
    const spacingX = 3.5;
    const spacingY = 2.5;

    useFrame(() => {
        if (groupRef.current) {
            // Scroll logic
            groupRef.current.position.y = scroll.offset * (Math.ceil(projects.length / columns) * spacingY);
        }
    });

    return (
        <group ref={groupRef} position={[-(columns - 1) * spacingX / 2, 2, 0]}>
            {projects.map((project: any, i: number) => {
                const x = (i % columns) * spacingX;
                const y = -Math.floor(i / columns) * spacingY;
                return (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={i}
                        position={[x, y, 0]}
                        onClick={onSelect}
                        isActive={activeProject?.id === project.id}
                    />
                );
            })}
        </group>
    );
};

export const ProjectGallery3D = ({ category = "all", search = "" }: any) => {
    const [activeProject, setActiveProject] = useState<any>(null);

    const filteredProjects = useMemo(() => {
        return PROJECTS.filter(p => {
            const matchesCategory = category === "all" || p.category === category;
            const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.tech.some(t => t.toLowerCase().includes(search.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [category, search]);

    return (
        <div className="relative h-full w-full">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <ScrollControls pages={Math.max(2, Math.ceil(filteredProjects.length / 3))} damping={0.2}>
                    <Grid
                        projects={filteredProjects}
                        onSelect={setActiveProject}
                        activeProject={activeProject}
                    />
                </ScrollControls>
            </Canvas>

            {/* Project Details Modal (Overlay) */}
            <AnimatePresence>
                {activeProject && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                    >
                        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl pointer-events-auto relative">
                            <button
                                onClick={() => setActiveProject(null)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white"
                            >
                                Close
                            </button>

                            <div className="flex flex-col md:flex-row gap-6">
                                <img
                                    src={activeProject.image}
                                    alt={activeProject.title}
                                    className="w-full md:w-1/2 h-48 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">{activeProject.title}</h3>
                                    <p className="text-gray-300 mb-4">{activeProject.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {activeProject.tech.map((t: string) => (
                                            <span key={t} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                            <ExternalLink className="w-4 h-4" /> Demo
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors">
                                            <Github className="w-4 h-4" /> Code
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
