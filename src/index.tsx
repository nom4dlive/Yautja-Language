/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState, useRef, useCallback, ChangeEvent } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const YAUTJA_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const YAUTJA_FONT_BASE64 = 'data:font/woff;charset=utf-8;base64,d09GRgABAAAAAAAoAAsAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABQAAAAEAAAABwQYAATGttYXAAAGPAAAABPAAAAsxNn1fUZ2FzcHAAAGtAAAAACAAAAAwAA+5yZ2x5ZgAAAmgAAANAAAAgZ/X8JmloZWFkAAABgAAAADAAAAA2C4kQzGhoaGUAAAHkAAAAIAAAACAE5QOxaG10eAAAB+gAAAEWAAAEQkE22S5sb2NhAAAJqAAAAKgAAAB4r0VfS21heHAAABkAAAAAHwAAACAAWQA/bmFtZQAAEQAAAAEAAAEDwIicQHBvc3QAAAXkAAAAzAAAAK1Ithv3eJzFkcsNgzAUQ9/wK5Mmk008IEmzL3q3QWk3eY0E19QzXh68k4RzV/L4T/g6cK07N26n1GfO3/R6yP2Xz2m+ZftxKq9f26g/2j1z0yT1U/TqWq7yv+nQ7N0J/Rk9Wz/eWv2N3t32p+u9p/n0b/P2w3bO/Z3Vv0N+P/d9sZ33v71/Tf/A/QnN/Qv/30/b7/x7L777d/kLAAIAAAAQACIAAAAARmx1dGVyAAgAAAACAHgAAAAAAd4AAAACAAIAAAADAFkAAAAAAAAAAdwAAAAAAAAAAQAAAAAAAACBAAAB4AAAAAAAAAAAAAAAgAAAAAAAABIAAAAAQAAAAAAAAAFAAoAAABSAHIAQwBNAFUAMQAwAEMAWgBHAHQARwBwAFMAQQBzAE0ATABwAFoAawBvAGIAYwBYAEUAVgBYAE0AVAB4AEsASgBNAG8AYQBjAE4AUQBOAEkAUwBaAF8AZwBQAFUAYgByAGUASgBuAG4ALgAuAC4ACgBwAHIATgBNAGYAUQBKAE0ASABxAHIAcgB0AGgAdQByAHUAcABjAGsAdwBuAEkAcgA2AHMAdgBvACQAYwBpAHYAZgB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwBvAG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw0AdgBpAGYAYwB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwB2AG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw0AdgBpAGYAYwB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwB2AG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw0AdgBpAGYAYwB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwB2AG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw0AdgBpAGYAYwB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwB2AG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw0AdgBpAGYAYwB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwB2AG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw0AdgBpAGYAYwB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwB2AG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw0AdgBpAGYAYwB5AG0AeQBmAGQAYwB4AGUAbwB2AG4AbABhAFgATQBuAFEAYgBpAG8AYQB6AHgAcwBkAHQAcABsAGEAYgByAGoAdwB2AG8AbwB1AGQAdgBxAHoAYwBnAEkAUgBoAFEASQBSAFUAVABnAFUAcgBMACoAFwAgAGIAbwByAHUAdwA3AHcALgByAE8AOABzAHUAeAB5AGUASAB0AEgASABoAEgAbwBCAGUAbwA5AHUAegBQAE0ATgBVADQAVwBMAFAAVABNAEQASABLAGYASwBEAFYARwBwAG8AdABnAHQATgB6AFoAbQBEADkASQBWAFkATwBXAEMATABhAEcAbQBhAGwAbABYAEcARgBkAE0ASABoAFQASAAgAGgAUQBQACcAZgBUAE0ASABhAHIAdgBqAHoAZgBQAE0ASAAgAGwAVgBvAFIAawBqAHoAUgBVAG4AdQBtAHAAZwBJAE4AMwA4AEkAVgBDAGwAaQBHADYAawBpAGgAawBPAGsAbQBGADQAVwBEAFYAdABJAFoARwBvAHIAeQBuAFkAUABHAFUAUgBHAE0ARgBkAE8AUQBVAHUARQBWAFgATQB2AFEAbABZAHcAbQB4AEwASQBOAEYAVgBMAFUAUABvAFYAZABtAEgAZgBQAHUAcwBaAFcAbgBnAGkASQB2AE8ATgB2AHIAcQBDAEcATABtAFcASgByAEIAbgBnAE8AVAB0AFkAaQBCAE4AbgBQAEoATABZAE8ATABtAFIAawBvAFQAVwBlAFcAVQBJAFoAVwBnAE0AZwBYAFUATABQAE8ASQBqAFYASgBBAE8AWABNAEoAUgBlAEwASwBDAC4AWw==';

// A animação começa com todos os sliders de efeito em 0.
const defaultConfig = {
    density: 100,
    speed: 0,
    size: 20,
    color: '#DC143C',
    glitch: 0,
    charMutationRate: 0,
    baseOpacity: 100,
    mode: 'rain',
    gridCols: 25,
    gridRows: 15,
    charSpacing: 0,
    glitchTime: 10,
    randomMove: 0,
    glowIntensity: 0,
    blurIntensity: 0,
    opacityFlicker: 0,
    respawnRate: 98
};

const presets = {
    rain: { ...defaultConfig, mode: 'rain', speed: 5, charMutationRate: 20, glowIntensity: 8, density: 150, size: 24, baseOpacity: 90, opacityFlicker: 20 },
    grid: { ...defaultConfig, mode: 'grid', speed: 2, glitch: 20, glowIntensity: 12, charMutationRate: 5 },
    overload: {
        ...defaultConfig,
        mode: 'rain',
        density: 300,
        speed: 15,
        glitch: 50,
        charMutationRate: 70,
        glowIntensity: 15,
        opacityFlicker: 20,
        randomMove: 2,
    },
    stealth: {
        ...defaultConfig,
        mode: 'rain',
        speed: 2,
        baseOpacity: 60,
        glowIntensity: 4,
        color: '#00FF7F',
        glitch: 5,
    }
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
        if (Math.random() < effectiveMutationRate) this.char = getRandomChar();

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

function ControlsPanel({ config, setConfig, handleConfigChange }) {
    const [activeTab, setActiveTab] = useState('animation');

    const applyPreset = (presetName) => {
        setConfig(presets[presetName]);
    };
    
    const setMode = (modeName) => {
        setConfig(prevConfig => ({ ...prevConfig, mode: modeName }));
    };

    const tabs = {
        general: 'Geral',
        animation: 'Animação',
        appearance: 'Aparência',
        layout: 'Layout',
        effects: 'Efeitos',
    };

    return (
        <div id="controls-panel">
            <div className="presets-container">
                <label className="text-lg">Presets</label>
                <div className="preset-buttons">
                    {Object.keys(presets).map(name => (
                        <button key={name} onClick={() => applyPreset(name)} className="preset-button">{name}</button>
                    ))}
                </div>
            </div>

            <div className="tabs-container">
                {Object.entries(tabs).map(([key, name]) => (
                    <button key={key} onClick={() => setActiveTab(key)} className={`tab-button ${activeTab === key ? 'active' : ''}`}>{name}</button>
                ))}
            </div>

            <div className="controls-grid">
                {activeTab === 'general' && (
                    <>
                        <div className="flex flex-row justify-center gap-2">
                            <button onClick={() => setMode('rain')} className={`mode-button ${config.mode === 'rain' ? 'active' : ''}`}>Chuva Matrix</button>
                            <button onClick={() => setMode('static')} className={`mode-button ${config.mode === 'static' ? 'active' : ''}`}>Grade Aleatória</button>
                            <button onClick={() => setMode('grid')} className={`mode-button ${config.mode === 'grid' ? 'active' : ''}`}>Grade Fixa</button>
                        </div>
                        <ControlInput label="Cor" id="color" type="color" value={config.color} onChange={handleConfigChange} />
                    </>
                )}
                {activeTab === 'animation' && (
                    <>
                        <ControlInput label="Velocidade" id="speed" value={config.speed} min={0} max={20} onChange={handleConfigChange} />
                        <ControlInput label="Mutação Símbolo" id="charMutationRate" value={config.charMutationRate} min={0} max={100} onChange={handleConfigChange} unit="%" />
                        <ControlInput label="Taxa de Respawn" id="respawnRate" value={config.respawnRate} min={80} max={100} onChange={handleConfigChange} unit="%" />
                    </>
                )}
                {activeTab === 'appearance' && (
                    <>
                        <ControlInput label="Tamanho" id="size" value={config.size} min={10} max={60} onChange={handleConfigChange} unit="px" />
                        <ControlInput label="Opacidade Base" id="baseOpacity" value={config.baseOpacity} min={0} max={100} onChange={handleConfigChange} unit="%" />
                        <ControlInput label="Brilho (Glow)" id="glowIntensity" value={config.glowIntensity} min={0} max={20} onChange={handleConfigChange} unit="px" />
                        <ControlInput label="Desfoque (Blur)" id="blurIntensity" value={config.blurIntensity} min={0} max={5} onChange={handleConfigChange} unit="px" />
                    </>
                )}
                {activeTab === 'layout' && (
                    <>
                        {config.mode === 'rain' || config.mode === 'static' ?
                            <ControlInput label="Símbolos Ativos" id="density" value={config.density} min={10} max={300} onChange={handleConfigChange} />
                            :
                            <>
                                <ControlInput label="Colunas (Grid)" id="gridCols" value={config.gridCols} min={5} max={50} onChange={handleConfigChange} />
                                <ControlInput label="Linhas (Grid)" id="gridRows" value={config.gridRows} min={5} max={30} onChange={handleConfigChange} />
                                <ControlInput label="Espaçamento" id="charSpacing" value={config.charSpacing} min={0} max={20} onChange={handleConfigChange} unit="px" />
                            </>
                        }
                    </>
                )}
                {activeTab === 'effects' && (
                    <>
                        <ControlInput label="Flicker (Posição)" id="glitch" value={config.glitch} min={0} max={100} onChange={handleConfigChange} unit="%" />
                        <ControlInput label="Tempo de Flicker" id="glitchTime" value={config.glitchTime} min={10} max={500} onChange={handleConfigChange} unit="ms" />
                        <ControlInput label="Mov. Aleatório" id="randomMove" value={config.randomMove} min={0} max={10} onChange={handleConfigChange} unit="px" />
                        <ControlInput label="Opacidade Flicker" id="opacityFlicker" value={config.opacityFlicker} min={0} max={50} onChange={handleConfigChange} unit="%" />
                    </>
                )}
            </div>
        </div>
    );
}

function App() {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const lastTimeRef = useRef(performance.now());
    const charsRef = useRef([]);
    const [config, setConfig] = useState(defaultConfig);
    const configRef = useRef(config);
    configRef.current = config;
    
    const [isFontLoaded, setIsFontLoaded] = useState(false);
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar Código');
    const embedCodeRef = useRef(null);

    const handleConfigChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setConfig(prevConfig => ({
            ...prevConfig,
            [id]: type === 'range' ? parseFloat(value) : value,
        }));
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

    const embedCode = `<iframe src="${window.location.href}" width="800" height="600" style="border:2px solid ${config.color}; border-radius: 0.5rem; overflow: hidden;" title="Analisador Yautja"></iframe>`;

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

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        
        const canvasWrapper = canvas.parentElement;
        canvas.width = canvasWrapper.clientWidth;
        canvas.height = canvasWrapper.clientHeight;

        const count = config.mode === 'grid' ? config.gridCols * config.gridRows : config.density;
        const newChars = Array.from({ length: count }, (_, i) => new YautjaChar(i, canvas));
        charsRef.current = newChars;

        lastTimeRef.current = performance.now();
        animationFrameId.current = requestAnimationFrame(animateLoop);
    }, [config.mode, config.gridCols, config.gridRows, config.density, animateLoop]);

    useEffect(() => {
        const loadFont = async () => {
            try {
                const yautjaFont = new FontFace('Yautja', `url(${YAUTJA_FONT_BASE64})`);
                await yautjaFont.load();
                document.fonts.add(yautjaFont);
                setIsFontLoaded(true);
            } catch (err) {
                console.error('Falha ao carregar a fonte Yautja programaticamente:', err);
                // Mesmo em caso de falha, continuamos para que o app não trave e use a fonte de fallback.
                setIsFontLoaded(true);
            }
        };

        loadFont();
    }, []);


    useEffect(() => {
        // A inicialização do canvas agora espera a fonte ser carregada.
        if (!isFontLoaded) return;

        initCanvas();
        window.addEventListener('resize', initCanvas);
        return () => {
            window.removeEventListener('resize', initCanvas);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [initCanvas, isFontLoaded]); // Adicionamos isFontLoaded como dependência.

    useEffect(() => {
        document.documentElement.style.setProperty('--predator-red', config.color);
        const canvasWrapper = canvasRef.current?.parentElement;
        if (canvasWrapper) {
            canvasWrapper.style.filter = `blur(${config.blurIntensity}px)`;
        }
    }, [config.color, config.blurIntensity]);

    return (
        <div className="app-layout">
            <main className="main-content">
                <header className="header">
                    <h1 className="title">Analisador Yautja</h1>
                    <button className="config-toggle" onClick={() => setIsControlsVisible(v => !v)}>
                        {isControlsVisible ? 'Fechar Painel' : 'Configurações'}
                    </button>
                </header>

                <div id="canvas-wrapper">
                    {!isFontLoaded && <div className="font-loading-overlay">CARREGANDO FONTE...</div>}
                    <canvas id="yautja-canvas" ref={canvasRef} style={{ visibility: isFontLoaded ? 'visible' : 'hidden' }}></canvas>
                </div>

                <div id="embed-container">
                    <label className="embed-label" htmlFor="embed-code">Código de Incorporação</label>
                    <textarea id="embed-code" readOnly ref={embedCodeRef} value={embedCode} rows={3}></textarea>
                    <button className="copy-button" onClick={handleCopy}>{copyButtonText}</button>
                </div>
            </main>
            <aside className={`controls-sidebar ${isControlsVisible ? 'visible' : ''}`}>
                <ControlsPanel 
                    config={config}
                    setConfig={setConfig}
                    handleConfigChange={handleConfigChange}
                />
            </aside>
        </div>
    );
}
interface ControlInputProps {
    label: string;
    id: string;
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    min?: number;
    max?: number;
    unit?: string;
    type?: 'range' | 'color';
}

function ControlInput({ label, id, value, min, max, onChange, unit, type = 'range' }: ControlInputProps) {
    return (
        <div className="control-group">
            <label htmlFor={id}>{label}</label>
            {type === 'range' ? (
                <>
                    <input type="range" id={id} min={min} max={max} value={value} onChange={onChange} />
                    <span className="text-xs">{value}{unit}</span>
                </>
            ) : (
                <input type="color" id={id} value={value as string} onChange={onChange} />
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);