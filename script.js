document.addEventListener('DOMContentLoaded', () => {
    
    req = new XMLHttpRequest();
    req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
    req.send();
    req.onload = () => {
        dataset = JSON.parse(req.responseText);

        const w = 900;
        const h = 500;
        const padding = 50;

        const svg = d3.select('div')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        const xScale = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.Year-1), d3.max(dataset, d => d.Year)])
            .range([padding, w-padding]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.Seconds-20), d3.max(dataset, d => d.Seconds)])
            .range([h-padding, padding]);

        console.log(xScale(dataset[0].Year));

        svg.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => xScale(d.Year))
            .attr('cy', (d,i) => yScale(d.Seconds))
            .attr('r', 5)
            .attr('class', 'dot')
            .attr('data-xvalue', (d,i) => d.Year)
            .attr('data-yvalue', (d,i) => {
                let date = new Date();
                date.setMinutes(Number(d.Time.split(':')[0]));
                date.setHours(Number(d.Time.split(':')[1]));
                return date;
            });

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('.0f'));

        svg.append('g')
            .attr('transform', 'translate(0,' + (h-padding) + ')')
            .attr('id', 'x-axis')
            .call(xAxis);

        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', 'translate(' + padding + ',0)')
            .attr('id', 'y-axis')
            .call(yAxis);
    }

});