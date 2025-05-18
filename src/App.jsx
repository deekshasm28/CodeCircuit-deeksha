import React, { useState, useEffect, useMemo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Search, FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categoryColors = {
  "diatomic nonmetal": "bg-green-500 hover:bg-green-400",
  "noble gas": "bg-purple-500 hover:bg-purple-400",
  "alkali metal": "bg-red-500 hover:bg-red-400",
  "alkaline earth metal": "bg-orange-500 hover:bg-orange-400",
  "metalloid": "bg-yellow-500 hover:bg-yellow-400",
  "polyatomic nonmetal": "bg-lime-500 hover:bg-lime-400",
  "post-transition metal": "bg-blue-500 hover:bg-blue-400",
  "transition metal": "bg-indigo-500 hover:bg-indigo-400",
  "lanthanide": "bg-pink-500 hover:bg-pink-400",
  "actinide": "bg-rose-500 hover:bg-rose-400",
  "unknown, probably transition metal": "bg-gray-500 hover:bg-gray-400",
  "unknown, probably post-transition metal": "bg-gray-500 hover:bg-gray-400",
  "unknown, probably metalloid": "bg-gray-500 hover:bg-gray-400",
  "unknown, predicted to be noble gas": "bg-gray-500 hover:bg-gray-400"
};

const phaseColors = {
  "Gas": "border-sky-400",
  "Liquid": "border-blue-600",
  "Solid": "border-stone-400",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const filterVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.2
    }
  }
};

// Add 3D animation variants
const elementVariants = {
  initial: { 
    rotateX: 0,
    rotateY: 0,
    scale: 1
  },
  hover: {
    rotateX: [0, 10, -10, 0],
    rotateY: [0, 10, -10, 0],
    scale: 1.1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

const tooltipVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    rotateX: -20,
    transformOrigin: "center center"
  },
  visible: { 
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const ElementTile = React.memo(({ element, onElementClick, isHighlighted, isInitialAnimation, index }) => {
  const colorClass = categoryColors[element.category] || "bg-gray-700 hover:bg-gray-600";
  const phaseClass = phaseColors[element.phase] || "border-gray-500";
  const [isCenterHovered, setIsCenterHovered] = useState(false);

  // Calculate initial position for numerical layout
  const initialX = (index % 10) * 60;
  const initialY = Math.floor(index / 10) * 60;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate distance from center
    const distance = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + 
      Math.pow(mouseY - centerY, 2)
    );
    
    // Show tooltip only if mouse is within 20px of center
    setIsCenterHovered(distance < 20);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isCenterHovered}>
        <TooltipTrigger asChild>
          <motion.div
            layout
            variants={elementVariants}
            initial={isInitialAnimation ? {
              x: initialX,
              y: initialY,
              scale: 0.5,
              opacity: 0,
              position: 'absolute',
              left: 0,
              top: 0
            } : "initial"}
            whileHover="hover"
            animate={isInitialAnimation ? {
              x: initialX,
              y: initialY,
              scale: 1,
              opacity: 1,
              transition: {
                duration: 0.3,
                delay: index * 0.01
              }
            } : {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              position: 'relative',
              transition: {
                duration: 0.5,
                delay: index * 0.005,
                type: "spring",
                stiffness: 200,
                damping: 20
              }
            }}
            style={{ 
              gridColumnStart: element.xpos, 
              gridRowStart: element.ypos,
              cursor: 'pointer',
              filter: isHighlighted ? 'none' : 'grayscale(100%) blur(3px) brightness(0.7)',
              transition: 'all 0.3s ease-in-out',
              transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isHighlighted ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none',
              zIndex: isHighlighted ? 10 : 1,
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
            className={`element-tile p-1.5 md:p-2 rounded-md shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 ${colorClass} border-2 ${phaseClass} backdrop-blur-sm relative group`}
            onClick={() => onElementClick(element)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsCenterHovered(false)}
            role="button"
            tabIndex={0}
            aria-label={`Element: ${element.name}`}
          >
            <motion.div 
              className={`text-xs font-bold ${isHighlighted ? 'text-white' : 'text-white text-opacity-80'}`}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              {element.number}
            </motion.div>
            <motion.div 
              className={`text-xl md:text-2xl font-black text-center my-0.5 md:my-1 ${isHighlighted ? 'text-white' : 'text-white text-opacity-90'}`}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              {element.symbol}
            </motion.div>
            <motion.div 
              className={`text-xxs md:text-xs text-center truncate ${isHighlighted ? 'text-white' : 'text-white text-opacity-70'}`}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              {element.name}
            </motion.div>
            
            {/* Center hover indicator */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ scale: 0.8 }}
              whileHover={{ scale: 1 }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-50 border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-xl max-w-md backdrop-blur-md"
          side="top"
          align="center"
          sideOffset={10}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <motion.div 
            className="flex flex-col gap-3"
            initial={{ rotateX: -20, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-4">
              <motion.div 
                className="w-24 h-24 relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img 
                  src={`https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/images/${element.symbol.toLowerCase()}.svg`}
                  alt={`${element.name} element`}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    // Try alternative image source
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = `https://images-of-elements.com/${element.name.toLowerCase()}.jpg`;
                    e.target.onerror = (e) => {
                      // If both sources fail, show a styled placeholder
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2YjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                    };
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
              </motion.div>
              <motion.div 
                className="flex-1 min-w-0"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-bold text-xl mb-1">{element.name} ({element.symbol})</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p className="text-slate-600 dark:text-slate-300">Atomic #: {element.number}</p>
                  <p className="text-slate-600 dark:text-slate-300">Mass: {element.atomic_mass ? element.atomic_mass.toFixed(3) : 'N/A'}</p>
                  <p className="text-slate-600 dark:text-slate-300">Category: <span className="capitalize">{element.category}</span></p>
                  <p className="text-slate-600 dark:text-slate-300">Phase: {element.phase}</p>
                </div>
              </motion.div>
            </div>
            
            {element.summary && (
              <motion.div 
                className="mt-1 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-3 rounded transition-colors"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm leading-relaxed">{element.summary}</p>
              </motion.div>
            )}

            <motion.div 
              className="grid grid-cols-2 gap-3 text-sm"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-2 rounded transition-colors">
                <p className="text-slate-500 dark:text-slate-400">Melting Point</p>
                <p className="font-medium">{element.melt ? `${element.melt}K` : 'N/A'}</p>
              </div>
              <div className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-2 rounded transition-colors">
                <p className="text-slate-500 dark:text-slate-400">Boiling Point</p>
                <p className="font-medium">{element.boil ? `${element.boil}K` : 'N/A'}</p>
              </div>
            </motion.div>

            {/* Electron Configuration */}
            <motion.div
              className="mt-2 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-3 rounded transition-colors"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-slate-500 dark:text-slate-400 mb-1">Electron Configuration</p>
              <p className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">
                {element.electron_configuration || 'N/A'}
              </p>
              {element.electron_configuration_semantic && (
                <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">
                  Simplified: {element.electron_configuration_semantic}
                </p>
              )}
            </motion.div>
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
ElementTile.displayName = 'ElementTile';

function App() {
  const [elements, setElements] = useState([]);
  const [filteredElements, setFilteredElements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialAnimation, setIsInitialAnimation] = useState(true);

  useEffect(() => {
    const fetchElements = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/elements.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const processedData = data.map(el => ({
          ...el,
          atomic_mass: typeof el.atomic_mass === 'number' ? el.atomic_mass : parseFloat(el.atomic_mass) || null,
          number: parseInt(el.number, 10)
        }));

        setElements(processedData);
        setFilteredElements(processedData);
      } catch (error) {
        console.error("Failed to load elements data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchElements();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsInitialAnimation(false);
      }, 1500); // Reduced to 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const categories = useMemo(() => {
    if (!elements.length) return [];
    const uniqueCategories = [...new Set(elements.map(el => el.category).filter(Boolean))];
    return ['all', ...uniqueCategories.sort()];
  }, [elements]);

  const phases = useMemo(() => {
    if (!elements.length) return [];
    const uniquePhases = [...new Set(elements.map(el => el.phase).filter(Boolean))];
    return ['all', ...uniquePhases.sort()];
  }, [elements]);

  useEffect(() => {
    let tempElements = elements.map(el => {
      const matchesSearch = !searchTerm || 
        el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        el.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || el.category === categoryFilter;
      const matchesPhase = phaseFilter === 'all' || el.phase === phaseFilter;
      
      return {
        ...el,
        isHighlighted: matchesSearch && matchesCategory && matchesPhase
      };
    });

    setFilteredElements(tempElements);
  }, [searchTerm, categoryFilter, phaseFilter, elements]);

  const handleElementClick = (element) => {
    console.log("Clicked element:", element.name);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setPhaseFilter('all');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Loading container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Squid Game Loading Animation */}
          <div className="flex items-center justify-center mb-8">
            <div className="loader">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32"></circle>
              </svg>
            </div>
            
            <div className="loader triangle">
              <svg viewBox="0 0 86 80">
                <polygon points="43 8 79 72 7 72"></polygon>
              </svg>
            </div>
            
            <div className="loader">
              <svg viewBox="0 0 80 80">
                <rect x="8" y="8" width="64" height="64"></rect>
              </svg>
            </div>
          </div>

          {/* Loading text */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text mb-2">
              Loading Periodic Table
            </h2>
            <p className="text-slate-400">
              Discovering the elements of the universe...
            </p>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            className="mt-6 w-48 h-1 bg-slate-800 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            >
              {['H', 'O', 'C', 'N', 'Fe'][i]}
            </motion.div>
          ))}
        </div>

        {/* Squid Game Loading Animation Styles */}
        <style jsx>{`
          .loader {
            --path: white;
            --dot: #f40af0;
            --duration: 3s;
            width: 44px;
            height: 44px;
            position: relative;
            display: inline-block;
            margin: 0 16px;
          }
          .loader:before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            position: absolute;
            display: block;
            background: var(--dot);
            top: 37px;
            left: 19px;
            transform: translate(-18px, -18px);
            animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
          }
          .loader svg {
            display: block;
            width: 100%;
            height: 100%;
          }
          .loader svg rect,
          .loader svg polygon,
          .loader svg circle {
            fill: none;
            stroke: var(--path);
            stroke-width: 10px;
            stroke-linejoin: round;
            stroke-linecap: round;
          }
          .loader svg polygon {
            stroke-dasharray: 145 76 145 76;
            stroke-dashoffset: 0;
            animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
          }
          .loader svg rect {
            stroke-dasharray: 192 64 192 64;
            stroke-dashoffset: 0;
            animation: pathRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
          }
          .loader svg circle {
            stroke-dasharray: 150 50 150 50;
            stroke-dashoffset: 75;
            animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
          }
          .loader.triangle {
            width: 48px;
          }
          .loader.triangle:before {
            left: 21px;
            transform: translate(-10px, -18px);
            animation: dotTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
          }
          
          @keyframes pathTriangle {
            33% { stroke-dashoffset: 74; }
            66% { stroke-dashoffset: 147; }
            100% { stroke-dashoffset: 221; }
          }
          @keyframes dotTriangle {
            33% { transform: translate(0, 0); }
            66% { transform: translate(10px, -18px); }
            100% { transform: translate(-10px, -18px); }
          }
          @keyframes pathRect {
            25% { stroke-dashoffset: 64; }
            50% { stroke-dashoffset: 128; }
            75% { stroke-dashoffset: 192; }
            100% { stroke-dashoffset: 256; }
          }
          @keyframes dotRect {
            25% { transform: translate(0, 0); }
            50% { transform: translate(18px, -18px); }
            75% { transform: translate(0, -36px); }
            100% { transform: translate(-18px, -18px); }
          }
          @keyframes pathCircle {
            25% { stroke-dashoffset: 125; }
            50% { stroke-dashoffset: 175; }
            75% { stroke-dashoffset: 225; }
            100% { stroke-dashoffset: 275; }
          }
        `}</style>
      </div>
    );
  }
  
  const periodicTableGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
    gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
    gap: '4px',
  };

  return (
    <motion.div 
      className={`min-h-screen relative ${darkMode ? 'dark bg-slate-900' : 'bg-slate-100'} text-slate-900 dark:text-slate-50 transition-colors duration-300 p-2 sm:p-4 overflow-hidden`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Space background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-0">
        {/* Nebula effect */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full bg-purple-500/10 blur-[100px]"
            style={{
              left: '10%',
              top: '20%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[80px]"
            style={{
              right: '15%',
              bottom: '30%',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Stars with enhanced movement */}
        <div className="absolute inset-0">
          {[...Array(200)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.8 + 0.2,
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.8, 0.2],
                x: [0, Math.random() * 20 - 10],
                y: [0, Math.random() * 20 - 10],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Planets with orbital paths */}
        <div className="absolute inset-0">
          {/* Orbital paths */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute border border-white/10 rounded-full"
                style={{
                  width: `${(i + 1) * 15}%`,
                  height: `${(i + 1) * 15}%`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%) rotate(0deg)',
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: (i + 1) * 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Mercury - Small, gray planet */}
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-gray-400"
            style={{
              left: '5%',
              top: '20%',
            }}
            animate={{
              rotate: 360,
              x: [0, 100, 0, -100, 0],
              y: [0, -50, 0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-500/50 to-transparent" />
          </motion.div>

          {/* Venus - Yellowish planet with thick atmosphere */}
          <motion.div
            className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-500"
            style={{
              left: '15%',
              top: '30%',
            }}
            animate={{
              rotate: -360,
              x: [0, 150, 0, -150, 0],
              y: [0, -75, 0, 75, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-600/50 to-transparent" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/30 to-transparent" />
          </motion.div>

          {/* Earth - Blue planet with continents */}
          <motion.div
            className="absolute w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-blue-400"
            style={{
              left: '25%',
              top: '40%',
            }}
            animate={{
              rotate: 360,
              x: [0, 200, 0, -200, 0],
              y: [0, -100, 0, 100, 0],
            }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-600/30 to-transparent" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/50 to-transparent" />
          </motion.div>

          {/* Mars - Red planet */}
          <motion.div
            className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-red-700 to-red-500"
            style={{
              left: '35%',
              top: '25%',
            }}
            animate={{
              rotate: -360,
              x: [0, 250, 0, -250, 0],
              y: [0, -125, 0, 125, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600/50 to-transparent" />
          </motion.div>

          {/* Jupiter - Largest planet with bands */}
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-orange-700 to-orange-500"
            style={{
              right: '10%',
              top: '10%',
            }}
            animate={{
              rotate: 360,
              x: [0, 300, 0, -300, 0],
              y: [0, -150, 0, 150, 0],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-600/50 to-transparent" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 to-transparent" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-600/20 to-transparent" />
          </motion.div>

          {/* Saturn - With rings */}
          <motion.div
            className="absolute w-64 h-64"
            style={{
              right: '25%',
              top: '30%',
            }}
            animate={{
              rotate: -360,
              x: [0, 350, 0, -350, 0],
              y: [0, -175, 0, 175, 0],
            }}
            transition={{
              duration: 50,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-yellow-700 to-yellow-500">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-600/50 to-transparent" />
            </div>
            {/* Saturn's rings */}
            <div className="absolute inset-0 rounded-full border-[8px] border-yellow-600/30 transform rotate-[20deg]" />
            <div className="absolute inset-0 rounded-full border-[4px] border-yellow-500/20 transform rotate-[40deg]" />
          </motion.div>

          {/* Uranus - Tilted blue-green planet */}
          <motion.div
            className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-cyan-700 to-cyan-500"
            style={{
              right: '40%',
              top: '50%',
            }}
            animate={{
              rotate: 360,
              x: [0, 400, 0, -400, 0],
              y: [0, -200, 0, 200, 0],
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-600/50 to-transparent" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-transparent" />
            <div className="absolute inset-0 rounded-full border-[2px] border-cyan-400/20 transform rotate-[90deg]" />
          </motion.div>

          {/* Neptune - Deep blue planet */}
          <motion.div
            className="absolute w-44 h-44 rounded-full bg-gradient-to-br from-blue-800 to-blue-600"
            style={{
              right: '55%',
              top: '35%',
            }}
            animate={{
              rotate: -360,
              x: [0, 450, 0, -450, 0],
              y: [0, -225, 0, 225, 0],
            }}
            transition={{
              duration: 55,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-700/50 to-transparent" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/30 to-transparent" />
          </motion.div>
        </div>
        
        {/* Satellite-like grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'top',
          }} />
        </div>

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 1000],
              y: [0, 1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
          </motion.div>
        ))}

        {/* Glowing orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
          style={{
            left: '20%',
            top: '30%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-purple-500/20 blur-2xl"
          style={{
            right: '25%',
            bottom: '40%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content with backdrop blur */}
      <div className="relative z-10">
        <motion.header 
          className="py-4 sm:py-6 mb-4 sm:mb-8 text-center relative mx-4"
          variants={headerVariants}
        >
        <motion.h1 
          className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text mb-1 sm:mb-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Periodic Table of Elements
        </motion.h1>
        <motion.p 
            className="text-sm sm:text-lg text-slate-700 dark:text-slate-300"
            variants={headerVariants}
        >
          Explore the building blocks of the universe.
        </motion.p>
          <motion.div 
            className="absolute top-4 right-4 flex items-center space-x-2"
            variants={headerVariants}
          >
          <Sun className={`w-5 h-5 ${!darkMode ? 'text-yellow-500' : 'text-slate-500'}`} />
          <Switch
            id="dark-mode-toggle"
            checked={darkMode}
            onCheckedChange={setDarkMode}
            aria-label="Toggle dark mode"
          />
          <Moon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-slate-500'}`} />
          </motion.div>
        </motion.header>

      <motion.div 
          variants={filterVariants}
          className="mb-6 p-4 mx-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <Label htmlFor="search-element" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Search Element</Label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 mt-3 w-5 h-5 text-slate-500 dark:text-slate-400" />
            <Input
              id="search-element"
              type="text"
              placeholder="Name or Symbol (e.g., Au)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full bg-white/80 dark:bg-slate-900/20 border-slate-300 dark:border-slate-700 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <Label htmlFor="category-filter" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Filter by Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="w-full bg-white/80 dark:bg-slate-900/20 border-slate-300 dark:border-slate-700">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900/90">
                {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize hover:bg-slate-100 dark:hover:bg-slate-800">
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
            <Label htmlFor="phase-filter" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Filter by Phase</Label>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                <SelectTrigger id="phase-filter" className="w-full bg-white/80 dark:bg-slate-900/20 border-slate-300 dark:border-slate-700">
                <SelectValue placeholder="Select Phase" />
              </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900/90">
                {phases.map(phase => (
                    <SelectItem key={phase} value={phase} className="capitalize hover:bg-slate-100 dark:hover:bg-slate-800">
                    {phase === 'all' ? 'All Phases' : phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
          <Button 
            onClick={resetFilters} 
            variant="outline" 
                className="w-full sm:w-auto border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-200"
          >
            <FilterX className="mr-2 h-4 w-4" /> Reset Filters
          </Button>
            </motion.div>
        </div>
      </motion.div>
      
      <main className="w-full overflow-x-auto">
        <motion.div 
          className="periodic-table-container mx-auto max-w-[1600px] p-1"
            variants={filterVariants}
        >
            <div style={periodicTableGridStyle} className="min-w-[1000px] md:min-w-full relative min-h-[600px]">
              <AnimatePresence>
                {filteredElements.map((element, index) => (
                  <ElementTile 
                    key={element.number} 
                    element={element} 
                    onElementClick={handleElementClick}
                    isHighlighted={element.isHighlighted}
                    isInitialAnimation={isInitialAnimation}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
        </motion.div>
      </main>
      </div>

      <Toaster />
    </motion.div>
  );
}

export default App;
