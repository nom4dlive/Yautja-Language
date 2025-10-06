/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const YAUTJA_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const defaultConfig = {
    density: 150,
    speed: 5,
    size: 24,
    color: '#DC143C',
    glitch: 10,
    charMutationRate: 20,
    baseOpacity: 90,
    mode: 'rain',
    gridCols: 25,
    gridRows: 15,
    charSpacing: 4,
    glitchTime: 50,
    randomMove: 0,
    glowIntensity: 8,
    blurIntensity: 0,
    opacityFlicker: 20,
    respawnRate: 98
};

const getRandomChar = () => YAUTJA_CHARS.charAt(Math.floor(Math.random() * YAUTJA_CHARS.length));

class YautjaChar {
    index;
    x;
    y;
    char;
    glitchX;
    glitchY;

    constructor(index, canvas) {
        this.index = index;
        this.reset(canvas);
    }

    reset(canvas) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.char = getRandomChar();
        this.glitchX = 0;
        this.glitchY = 0;
    }

    positionInGrid(config, canvas) {
        const colIndex = this.index % config.gridCols;
        const rowIndex = Math.floor(this.index / config.gridCols);

        const spacing = config.size + config.charSpacing;
        const totalWidth = config.gridCols * spacing;
        const totalHeight = config.gridRows * spacing;

        const centerX = (canvas.width - totalWidth) / 2;
        const centerY = (canvas.height - totalHeight) / 2;

        this.x = centerX + colIndex * spacing + (config.size * 0.5);
        this.y = centerY + rowIndex * spacing + (config.size * 0.5);
    }

    update(delta, config, canvas) {
        const effectiveMutationRate = config.charMutationRate * config.speed * 0.001;
        if (Math.random() < effectiveMutationRate) {
            this.char = getRandomChar();
        }

        if (config.mode === 'rain') {
            this.y += (config.speed * delta) / 16;
            if (this.y > canvas.height + config.size) {
                if (Math.random() * 100 > (100 - config.respawnRate)) {
                    this.x = Math.random() * canvas.width;
                }
                this.y = -config.size;
            }
        } else if (config.mode === 'grid') {
            this.positionInGrid(config, canvas);
        }

        this.glitchX = 0;
        this.glitchY = 0;
        if (Math.random() * 100 < config.glitch) {
            const shift = (Math.random() - 0.5) * (config.glitch * 0.5);
            this.glitchX = shift;
            this.glitchY = shift;
        }
        if (config.randomMove > 0) {
            this.glitchX += (Math.random() - 0.5) * config.randomMove;
            this.glitchY += (Math.random() - 0.5) * config.randomMove;
        }
    }

    draw(ctx, config) {
        let opacity = config.baseOpacity / 100;
        const flickerRange = config.opacityFlicker / 100;
        opacity = opacity * (1 - Math.random() * flickerRange);
        if (config.mode === 'rain' && this.y < 0) { opacity = 0; }

        ctx.fillStyle = config.color;
        ctx.globalAlpha = opacity;
        ctx.shadowColor = config.color;
        ctx.shadowBlur = config.glowIntensity;
        ctx.fillText(this.char, this.x + this.glitchX, this.y + this.glitchY);
    }
}


function App() {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const lastTimeRef = useRef(performance.now());
    const charsRef = useRef([]);
    const [config, setConfig] = useState(defaultConfig);
    const configRef = useRef(config);
    configRef.current = config;

    const [copyButtonText, setCopyButtonText] = useState('Copiar Código');
    const embedCodeRef = useRef(null);

    const handleConfigChange = (e) => {
        const { id, value, type } = e.target;
        setConfig(prevConfig => ({
            ...prevConfig,
            [id]: type === 'range' ? parseFloat(value) : value,
        }));
    };

    const setMode = (modeName) => {
        setConfig(prevConfig => ({ ...prevConfig, mode: modeName }));
    };

    const handleCopy = () => {
        if (embedCodeRef.current) {
            navigator.clipboard.writeText(embedCodeRef.current.value).then(() => {
                setCopyButtonText('Copiado!');
                setTimeout(() => setCopyButtonText('Copiar Código'), 2000);
            }).catch(err => {
                console.error('Falha ao copiar:', err);
            });
        }
    };

    const embedCode = `<iframe src="${window.location.href}" width="800" height="600" style="border:2px solid #DC143C; border-radius: 0.5rem; overflow: hidden;" title="Analisador Yautja"></iframe>`;


    const animateLoop = useCallback((time) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const currentConfig = configRef.current;

        const delta = time - lastTimeRef.current;
        lastTimeRef.current = time;

        ctx.fillStyle = currentConfig.mode === 'rain' ? 'rgba(0, 0, 0, 0.08)' : 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${currentConfig.size}px 'Yautja', monospace`;

        charsRef.current.forEach(char => {
            char.update(delta, currentConfig, canvas);
            char.draw(ctx, currentConfig);
        });

        animationFrameId.current = requestAnimationFrame(animateLoop);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const initChars = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }

            const canvasWrapper = canvas.parentElement;
            canvas.width = canvasWrapper.clientWidth;
            canvas.height = canvasWrapper.clientHeight;

            const newChars = [];
            const count = config.mode === 'grid' ? config.gridCols * config.gridRows : config.density;
            for (let i = 0; i < count; i++) {
                newChars.push(new YautjaChar(i, canvas));
            }
            charsRef.current = newChars;

            lastTimeRef.current = performance.now();
            animationFrameId.current = requestAnimationFrame(animateLoop);
        };

        initChars();
        window.addEventListener('resize', initChars);

        return () => {
            window.removeEventListener('resize', initChars);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [config.mode, config.gridCols, config.gridRows, config.density, animateLoop]);

    useEffect(() => {
        document.documentElement.style.setProperty('--predator-red', config.color);
        const canvasWrapper = canvasRef.current?.parentElement;
        if (canvasWrapper) {
            canvasWrapper.style.filter = `blur(${config.blurIntensity}px)`;
        }
    }, [config.color, config.blurIntensity]);


    return (
        <div className="flex flex-col items-center max-w-5xl w-full p-0 mx-auto">
            <header className="text-center mb-4">
                <h1 className="text-3xl md:text-4xl text-predator-red neon-red-glow uppercase font-bold font-yautja-title">
                    ANALISADOR YAUTJA
                </h1>
            </header>

            <div id="canvas-wrapper">
                <canvas id="yautja-canvas" ref={canvasRef}></canvas>
            </div>

            <div id="controls-floating">
                <div className="control-group w-full flex-row justify-center gap-2 mb-2 !text-white text-base">
                    <button id="mode-rain" onClick={() => setMode('rain')} className={`mode-button px-3 py-1 text-xs md:text-sm rounded-md text-white ${config.mode === 'rain' ? 'active bg-red-700/80 border-white' : 'bg-red-800/50 hover:bg-red-700/80 border-red-500'}`}>Chuva Matrix</button>
                    <button id="mode-static" onClick={() => setMode('static')} className={`mode-button px-3 py-1 text-xs md:text-sm rounded-md text-white ${config.mode === 'static' ? 'active bg-red-700/80 border-white' : 'bg-red-800/50 hover:bg-red-700/80 border-red-500'}`}>Grade Aleatória</button>
                    <button id="mode-grid" onClick={() => setMode('grid')} className={`mode-button px-3 py-1 text-xs md:text-sm rounded-md text-white ${config.mode === 'grid' ? 'active bg-red-700/80 border-white' : 'bg-red-800/50 hover:bg-red-700/80 border-red-500'}`}>Grade Fixa</button>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {/* CONTROLS */}
                    <ControlInput label="Colunas (Grid)" id="gridCols" value={config.gridCols} min={5} max={50} onChange={handleConfigChange} unit="" />
                    <ControlInput label="Linhas (Grid)" id="gridRows" value={config.gridRows} min={5} max={30} onChange={handleConfigChange} unit="" />
                    <ControlInput label="Espaçamento" id="charSpacing" value={config.charSpacing} min={1} max={10} onChange={handleConfigChange} unit="" />
                    <ControlInput label="Símbolos Ativos" id="density" value={config.density} min={10} max={300} onChange={handleConfigChange} unit="" />
                    <ControlInput label="Velocidade" id="speed" value={config.speed} min={0} max={20} onChange={handleConfigChange} unit="" />
                    <ControlInput label="Tamanho" id="size" value={config.size} min={10} max={60} onChange={handleConfigChange} unit="px" />
                    <ControlInput label="Mutação Símbolo" id="charMutationRate" value={config.charMutationRate} min={0} max={100} onChange={handleConfigChange} unit="%" />
                    <ControlInput label="Flicker (Posição)" id="glitch" value={config.glitch} min={0} max={100} onChange={handleConfigChange} unit="%" />
                    <ControlInput label="Tempo de Flicker" id="glitchTime" value={config.glitchTime} min={10} max={500} onChange={handleConfigChange} unit="ms" />
                    <ControlInput label="Mov. Aleatório" id="randomMove" value={config.randomMove} min={0} max={10} onChange={handleConfigChange} unit="px" />
                    <ControlInput label="Opacidade Base" id="baseOpacity" value={config.baseOpacity} min={10} max={100} onChange={handleConfigChange} unit="%" />
                    <ControlInput label="Opacidade Flicker" id="opacityFlicker" value={config.opacityFlicker} min={0} max={50} onChange={handleConfigChange} unit="%" />
                    <ControlInput label="Brilho (Glow)" id="glowIntensity" value={config.glowIntensity} min={0} max={20} onChange={handleConfigChange} unit="px" />
                    <ControlInput label="Desfoque (Blur)" id="blurIntensity" value={config.blurIntensity} min={0} max={5} onChange={handleConfigChange} unit="px" />
                    
                    <div className="control-group">
                        <label htmlFor="color">Cor</label>
                        <input type="color" id="color" value={config.color} onChange={handleConfigChange} />
                    </div>
                </div>
            </div>

            <div id="embed-container" className="w-full">
                <label className="embed-label" htmlFor="embed-code">
                    Código de Incorporação
                </label>
                <textarea
                    id="embed-code"
                    readOnly
                    ref={embedCodeRef}
                    value={embedCode}
                    rows={4}
                ></textarea>
                <button className="copy-button" onClick={handleCopy}>
                    {copyButtonText}
                </button>
            </div>
        </div>
    );
}

function ControlInput({ label, id, value, min, max, onChange, unit }) {
    return (
        <div className="control-group">
            <label htmlFor={id}>{label}</label>
            <input type="range" id={id} min={min} max={max} value={value} onChange={onChange} />
            <span className="text-xs">{value}{unit}</span>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
