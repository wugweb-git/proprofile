import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface DataPoint {
  axis: string;
  value: number;
}

const MOCK_HEATMAP_DATA: DataPoint[] = [
  { axis: 'Systems Thinking', value: 0.95 },
  { axis: 'Operational Logic', value: 0.88 },
  { axis: 'AI Synthesis', value: 0.92 },
  { axis: 'Product Strategy', value: 0.85 },
  { axis: 'Technical Depth', value: 0.75 },
  { axis: 'UX Psychology', value: 0.82 },
];

export const CognitiveHeatmap = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 400;
    const height = 400;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const angleStep = (Math.PI * 2) / MOCK_HEATMAP_DATA.length;

    // Draw Grid (Circles)
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const r = (radius / levels) * i;
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.05)')
        .attr('stroke-dasharray', '2,2');
    }

    // Draw Axes
    const axis = g.selectAll('.axis')
      .data(MOCK_HEATMAP_DATA)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleStep * i - Math.PI / 2))
      .attr('y2', (d, i) => radius * Math.sin(angleStep * i - Math.PI / 2))
      .attr('stroke', 'rgba(255, 255, 255, 0.1)');

    // Draw Labels
    axis.append('text')
      .attr('x', (d, i) => (radius + 20) * Math.cos(angleStep * i - Math.PI / 2))
      .attr('y', (d, i) => (radius + 20) * Math.sin(angleStep * i - Math.PI / 2))
      .attr('text-anchor', (d, i) => {
        const angle = angleStep * i - Math.PI / 2;
        if (angle > -Math.PI / 2 && angle < Math.PI / 2) return 'start';
        if (angle === -Math.PI / 2 || angle === Math.PI / 2) return 'middle';
        return 'end';
      })
      .attr('dy', '0.35em')
      .attr('fill', 'rgba(255, 255, 255, 0.4)')
      .attr('font-size', '8px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .text(d => d.axis.toUpperCase());

    // Draw Data Path
    const line = d3.lineRadial<DataPoint>()
      .angle((d, i) => i * angleStep)
      .radius(d => d.value * radius)
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(MOCK_HEATMAP_DATA)
      .attr('d', line)
      .attr('fill', 'rgba(220, 38, 38, 0.2)')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 2)
      .attr('class', 'data-path');

    // Draw Data Points
    g.selectAll('.dot')
      .data(MOCK_HEATMAP_DATA)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => d.value * radius * Math.cos(angleStep * i - Math.PI / 2))
      .attr('cy', (d, i) => d.value * radius * Math.sin(angleStep * i - Math.PI / 2))
      .attr('r', 3)
      .attr('fill', '#dc2626')
      .attr('stroke', '#000')
      .attr('stroke-width', 1);

  }, []);

  return (
    <div className="relative w-full aspect-square bg-white/5 rounded-[3rem] border border-white/5 p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-8 left-8">
        <span className="nothing-dot-matrix text-red-600">COGNITIVE_HEATMAP</span>
        <p className="text-[8px] font-mono text-white/20 uppercase mt-1">Skill Saturation // Real-time</p>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute bottom-8 right-8 text-right">
        <span className="text-[10px] font-mono text-white/40 uppercase">Systemic_Fit</span>
        <div className="text-2xl font-display font-bold text-white">94.2%</div>
      </div>
    </div>
  );
};
