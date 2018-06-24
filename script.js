document.addEventListener('DOMContentLoaded', () => {
    
    req = new XMLHttpRequest();
    req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
    req.send();
    req.onload = () => {
        dataset = JSON.parse(req.responseText);

        // Create scatterplot //
        const w = 900;
        const h = 500;
        const padding = 50;

        const svg = d3.select('div')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

        const createDate = (min,s) => {
            let d = new Date();
            d.setMinutes(min);
            d.setSeconds(s);
            return d;
        }

        const xScale = d3.scaleLinear()
            .domain([d3.min(dataset, d => d.Year), d3.max(dataset, d => d.Year)])
            .range([padding, w-padding]);

        const yScale = d3.scaleTime()
            .domain([d3.min(dataset, d => createDate( Number(d.Time.split(':')[0]), Number(d.Time.split(':')[1]) )), 
                d3.max(dataset, d => createDate( Number(d.Time.split(':')[0]), Number(d.Time.split(':')[1]) ) )])
            .range([h-padding, padding]);

        svg.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('cx', (d,i) => xScale(d.Year))
            .attr('cy', (d,i) => yScale(new Date(createDate( Number(d.Time.split(':')[0]), Number(d.Time.split(':')[1]) ))))
            .attr('r', 5)
            .attr('class', 'dot')
            .attr('data-xvalue', (d,i) => d.Year)
            .attr('data-yvalue', (d,i) => createDate( Number(d.Time.split(':')[0]), Number(d.Time.split(':')[1]) ))
            .style('fill', d => {
                if(d.Doping === '') return 'green';
                else return 'red';
            })
            .append('title')
            .attr('id', 'tooltip')
            .attr('data-year', d => d.Year)
            .text(d => 'Name: ' + d.Name + '\nNationality: ' + d.Nationality
                    + '\nYear: ' + d.Year + '\nTime: ' + d.Time 
                    + '\n' + d.Doping);

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('.0f'));

        svg.append('g')
            .attr('transform', 'translate(0,' + (h-padding) + ')')
            .attr('id', 'x-axis')
            .call(xAxis);

        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat('%M:%S'));

        svg.append('g')
            .attr('transform', 'translate(' + padding + ',0)')
            .attr('id', 'y-axis')
            .call(yAxis);

    }

});