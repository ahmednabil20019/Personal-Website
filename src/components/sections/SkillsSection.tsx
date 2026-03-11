import { useRef } from "react";
import { SkillDeck } from "@/components/skills/SkillDeck";
import NeuralBackground from "@/components/ui/flow-field-background";

export const SkillsSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section
            id="skills"
            ref={containerRef}
            className="py-16 md:py-24 relative overflow-hidden min-h-screen flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-20"
        >
            {/* Cinematic Background - Flow Field */}
            <NeuralBackground
                color="#e11d48"
                trailOpacity={0.2}
                speed={0.7}
                className="opacity-40"
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10 w-full mb-16 md:mb-32">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 tracking-tighter">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">Arsenal</span>
                    </h2>
                    <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
                        A tactical overview of my technical capabilities. Click on any module to inspect.
                    </p>
                </div>

                {/* Skills — CMD/Terminal view on all screen sizes */}
                <SkillDeck />
            </div>
        </section>
    );
};
