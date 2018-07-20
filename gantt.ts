import * as d3 from 'd3';
/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 */

export class Gantt {
    readonly FIT_TIME_DOMAIN_MODE = "fit";
    readonly FIXED_TIME_DOMAIN_MODE = "fixed";

    margin = {
        top: 20,
        right: 40,
        bottom: 20,
        left: 150
    };
    selector = 'body';
    xAxisSelector = '.wf-gantt-chart-x-axis';
    chartSelector = '.wf-gantt-chart';
    timeDomainStart = d3.timeDay.offset(new Date(), -3);
    timeDomainEnd = d3.timeHour.offset(new Date(), +3);
    timeDomainMode = this.FIT_TIME_DOMAIN_MODE; // fixed or fit
    taskTypes = [];
    taskStatus = [];
    height = document.body.clientHeight - this.margin.top - this.margin.bottom - 5;
    width = document.body.clientWidth - this.margin.right - this.margin.left - 5;
    tickFormat = "%H:%M";
    ticks = 4;
    barPaddingBottom = 5;
    minBarHeight = 60;
    maxBarHeight = 120;
    onClickBar = null;

    tooltipFormatStartDate = function (task) { return task.startDate; };
    tooltipFormatEndDate = function (task) { return task.endDate; };
    tooltipValueFormat = function (task) { return task.startDate - task.endDate };

    keyFunction(d) { return d.startDate + d.taskName + d.endDate; };
    rectTransform(d) {
        return "translate(" + this.x(d.startDate) + "," + this.y(d.taskName) + ")";
    };

    getHeight(count) {
        if (count < 5) {
            //console.warn(maxBarHeight);
            return count * this.maxBarHeight;
        }
        var newHeight = count * this.minBarHeight;
        //console.log(this.minBarHeight);
        return newHeight;
    }

    init() {
        const x = d3
            .scaleBand()
            .range([0, this.width - this.margin.left - this.margin.right]),
            y_1 = d3.scaleLinear()
                .domain(this.taskTypes))
                .range([0, this.getHeight(this.taskTypes.length) - this.margin.top - this.margin.bottom]),
            y = d3.scaleOrdinal()
                .domain(this.taskTypes)
                .rangeRoundBands([0, this.getHeight(this.taskTypes.length) - this.margin.top - this.margin.bottom], .5);


        const xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format(this.tickFormat))
            .tickSize(-this.getHeight(this.taskTypes.length))
            .ticks(this.ticks);

        const xAxis_2 = d3.svg.axis()
            .scale(x)
            .orient("top")
            .tickFormat(d3.time.format(this.tickFormat))
            .tickSize(-this.getHeight(this.taskTypes.length))
            .ticks(this.ticks);

        const yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            //.tickSize(0)
            .ticks(5)
            .tickPadding(12);
    }
    initTimeDomain(tasks) {
        if (this.timeDomainMode === this.FIT_TIME_DOMAIN_MODE) {
            if (tasks === undefined || tasks.length < 1) {
                this.timeDomainStart = d3.time.day.offset(new Date(), -3);
                this.timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            tasks.sort(function (a, b) { return b.endDate - a.endDate; });
            this.timeDomainEnd = tasks[0].endDate;

            tasks.sort(function (a, b) { return a.startDate - b.startDate; });
            this.timeDomainStart = tasks[0].startDate;
        }
    };
    x;
    xAxis;
    xAxis_2;
    y;
    yAxis;
    y_1;
    yAxis_2;
    gantt(tasks) {

        //      Render Tooltip
        const format = d3.format("%H:%M:%S %d.%m");
        const tooltip = d3.select(this.selector)
            .append("div")
            .attr("class", "c3-tooltip-container")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("display", "none");
        const body = tooltip
            .append("table")
            .attr("class", "c3-tooltip")
            .append("tbody");
        const tooltipTitle = body.append("tr")
            .append("th")
            .attr("colspan", "3");
        const tr = body.append("tr")
            .attr("class", "c3-tooltip-name-heatmap");
        const startTd = tr.append("td")
            .attr("class", "name");
        startTd.append("span")
            .style("background-color", "#003c65");
        const endTd = tr.append("td")
            .attr("class", "name");
        endTd.append("span")
            .style("background-color", "#003c65");
        const tooltipValue = tr.append("td")
            .attr("class", "value");


        this.initTimeDomain(tasks);


        this.x = d3.time.scale()
            .range([0, this.width - this.margin.left - this.margin.right])
            .domain([this.timeDomainStart, this.timeDomainEnd]);
        this.y_1 = d3.scale.linear()
            .domain(Object.keys(this.taskTypes))
            .range([0, this.getHeight(this.taskTypes.length) - this.margin.top - this.margin.bottom]);
        this.y = d3.scale.ordinal()
            .domain(this.taskTypes)
            .rangeRoundBands([0, this.getHeight(this.taskTypes.length) - this.margin.top - this.margin.bottom], .5);

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom")
            .tickFormat(d3.time.format(this.tickFormat))
            //.tickSubdivide(true)
            .tickSize(-this.getHeight(this.taskTypes.length))
            .ticks(this.ticks);

        this.xAxis_2 = d3.svg.axis()
            .scale(this.x)
            .orient("top")
            .tickFormat(d3.time.format(this.tickFormat))
            //.tickSubdivide(true)
            .tickSize(-this.getHeight(this.taskTypes.length))
            .ticks(this.ticks);


        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient("left")
            //.tickSize(2)
            .ticks(5)
            .tickPadding(12);


        var chart = d3.select(this.selector)
            .select(this.chartSelector)
            .append("svg")
            .attr("class", "chart")
            .attr("width", this.width)
            .attr("height", this.getHeight(this.taskTypes.length) + this.margin.top + this.margin.bottom);

        var svg = chart.append("g")
            .attr("class", "gantt-chart")
            .attr("width", this.width)
            .attr("height", this.getHeight(this.taskTypes.length) + this.margin.top + this.margin.bottom)
            .attr("transform", "translate(" + this.margin.left + ", " + this.margin.top + ")");

        svg.append("g")
            .attr("class", "wf-gantt-x-axis x axis")
            .attr("transform", "translate(0, " + (this.getHeight(this.taskTypes.length) - this.margin.top - this.margin.bottom) + ")")
            .call(this.xAxis);

        svg.select(".y")
            .call(this.yAxis)
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("transform", "translate(25, -" + this.y.rangeBand() + ")");


        var xAxisSvg = d3.select(this.xAxisSelector)
            .append('svg')
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", 20)
            .append("g");


        var xAxisDom = xAxisSvg.selectAll('.x.axis');
        if (xAxisDom.empty()) {
            xAxisDom = xAxisSvg.append("g")
                .attr("class", "wf-gantt-x-axis x axis");
        }
        xAxisDom
            .attr("transform", "translate(" + (this.margin.left) + "," + 15 + ")")
            .call(this.xAxis_2);


        svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis)
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("transform", "translate(25, -" + this.y.rangeBand() + ")");


        svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.width - this.margin.left - this.margin.right)
            .attr("height", this.getHeight(this.taskTypes.length));

        svg.append("g")
            .attr("class", "gantt-chart-container")
            .attr("clip-path", "url(#clip)");


        //var drw = chart.append("rect")
        //    .attr("class", "pane")
        //    .attr("width", width - margin.left - margin.right)
        //    .attr("height", getHeight(taskTypes.length))
        //    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


        var ganttChartGroup = svg.select(".gantt-chart-container");

        ganttChartGroup.selectAll("rect")
            .data(tasks, this.keyFunction)
            .enter()
            .append("rect")
            .attr("class",
                function (d) {
                    var statusClass = this.taskStatus[d.status] || "bar";
                    var clickable = this.onClickBar ? "clickable" : "";
                    return statusClass + clickable;
                })
            .style("fill", function (d) { return d.color; })
            // .attr("y", 0)
            .attr("transform", this.rectTransform)
            .attr("height", function (d) { return this.y.rangeBand() - this.barPaddingBottom; })
            .attr("width", function (d) { return (this.x(d.endDate) - this.x(d.startDate)); })
            //.attr("clip-path", "url(#clip)");
            .on("mouseout", _ => {
                tooltip.style("display", "none");
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr("stroke-width", 0);
            })
            .on("mousemove", (x, event) => {
                tooltipTitle
                    .html(x.name ? x.name : x.taskName);
                startTd.html(this.tooltipFormatStartDate(x));
                endTd.html(this.tooltipFormatEndDate(x));
                tooltipValue.html(this.tooltipValueFormat(x));
                tooltip
                    .style("top", (event.offsetY + 20) + "px")
                    .style("left", (event.offsetX + 20) + "px")
                    .style("display", "block")
                    .transition()
                    .duration(100)
                    .attr("stroke-width", 2);
            })
            .on("click", data => {
                if (this.onClickBar) {
                    this.onClickBar(data);
                }
            });

        var zoom = d3.behavior.zoom()
            .x(this.x)
            .y(this.y_1)
            .scaleExtent([0.5, 30])
            .scale(1)
            .on("zoom", this.redraw(tasks));

        chart.select(".gantt-chart").call(zoom);
        xAxisDom.call(zoom);
    };

    redraw(tasks) {
        var svg = d3.select(this.selector).select(this.chartSelector);
        var ganttChartGroup = svg.select(".gantt-chart-container");

        var rect = ganttChartGroup.selectAll("rect").data(tasks, this.keyFunction);
        rect
            .enter()
            .insert("rect", ":first-child")
            .attr("class",
                function (d) {
                    var statusClass = this.taskStatus[d.status] || "bar";
                    var clickable = this.onClickBar ? "clickable" : "";
                    return statusClass + clickable;
                })
            .style("fill", function (d) { return d.color; });
        rect
            .attr("transform", this.rectTransform)
            .attr("height", d => { return this.y.rangeBand() - this.barPaddingBottom; })
            .attr("width", d => { return (this.x(d.endDate) - this.x(d.startDate)); });

        rect.exit().remove();

        const xAxisSvg = svg.select(".gantt-chart").select(".x");
        xAxisSvg.call(this.xAxis).selectAll('.tick');

        const xAxisSvg_2 = d3.select(this.xAxisSelector);
        xAxisSvg_2.select(".x").call(this.xAxis_2).selectAll('.tick');
    };
    timeDomain(value) {
        if (!arguments.length) return [this.timeDomainStart, this.timeDomainEnd];
        this.timeDomainStart = +value[0], this.timeDomainEnd = +value[1];
    };
}
