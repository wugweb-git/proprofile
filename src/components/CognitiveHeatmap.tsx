import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const CognitiveHeatmap = () => {
  const d3Container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (d3Container.current) {
      // Clear previous instances
      d3.select(d3Container.current).select('svg').remove();

      const width = d3Container.current.clientWidth;
      const height = 400;

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('overflow', 'visible');

      // Mock Vector Clusters (M1.2 Sim)
      const nodes = [
        { id: 'Systemic Unfucking', r: 30, x: width * 0.3, y: height * 0.5, group: 1 },
        { id: 'Decentralized Ops', r: 20, x: width * 0.15, y: height * 0.3, group: 1 },
        { id: 'Fintech Structuring', r: 25, x: width * 0.45, y: height * 0.25, group: 2 },
        { id: 'Agentic Context', r: 35, x: width * 0.7, y: height * 0.45, group: 3 },
        { id: 'RAG Infrastructure', r: 20, x: width * 0.85, y: height * 0.7, group: 3 },
        { id: '0→1 Mindset', r: 15, x: width * 0.5, y: height * 0.8, group: 1 },
      ];

      const links = [
        { source: 'Systemic Unfucking', target: 'Decentralized Ops', value: 2 },
        { source: 'Systemic Unfucking', target: 'Fintech Structuring', value: 3 },
        { source: 'Agentic Context', target: 'RAG Infrastructure', value: 4 },
        { source: 'Agentic Context', target: 'Fintech Structuring', value: 1 },
        { source: 'Systemic Unfucking', target: '0→1 Mindset', value: 2 },
      ];

      const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
        .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));

      // Draw Links
      const link = svg.append('g')
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0.1)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', d => Math.sqrt(d.value));

      // Draw Nodes
      const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', d => d.r)
        .attr('fill', d => d.group === 3 ? '#FFD606' : '#f0f0f0') 
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended) as any);

      // Node Labels
      const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(d => d.id)
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('text-anchor', 'middle')
        .attr('dy', d => d.r + 12)
        .attr('fill', '#00000080');

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
          
        label
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y);
      });

      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
    }
  }, []);

  return (
    <div className="w-full bg-white border-2 border-black/5 rounded-[2rem] p-8 shadow-sm overflow-hidden mb-16 relative group">
      <div className="absolute top-8 left-8 z-10 flex flex-col pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-black/40 bg-nothing-yellow px-2 py-1 inline-flex w-max">
          M5.2: Cognitive Heatmap
        </span>
        <h3 className="font-display font-bold text-2xl mt-2 tracking-tight">Active Pulse Map</h3>
        <p className="text-black/50 text-xs font-mono max-w-sm mt-1">
          Real-time constellation derived from vector overlaps (PgVector mapping) within the last 30 days.
        </p>
      </div>

      <div ref={d3Container} className="w-full relative h-[400px] cursor-grab active:cursor-grabbing" />
    </div>
  );
};
