/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */


module powerbi.extensibility.visual {

    
import ValueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    export class Visual implements IVisual {
        private target: HTMLElement;
        private updateCount: number;
        private body;
        private svg: d3.Selection<HTMLElement>;
        private myVisualProp: any;
        private myVisualPropmyLineThickness: number;
        private padding: number = 20;
        private myMin: number;
        private myMax: number;
        private myMetricFormat: any;
        private myDecimal: number;
        private myNumberSize: number;
        private myDisplayUnits: any;
        private myTargetHideShow: boolean;
        private myBehavior: boolean;
        private myShowArrow: boolean;
        private myKPIColorDynamic: boolean;
        //gst begin
        private host: IVisualHost;
        private tooltips: VisualTooltipDataItem[];
        private act: string;
        private tar: string;
        private tip: string;
        private dName: DataViewMetadataColumn[];
        //gst end        

        constructor(options: VisualConstructorOptions) {

            this.host = options.host; //gst
            console.log('Visual constructor', options);
            this.target = options.element;
            //this.updateCount = 0;
            //console.log(options.element);

            this.body = d3.select(options.element);
            let svgDiv = this.body.append("div").classed('abc-div', true);

            this.svg = svgDiv.append("svg").classed('viz-svg', true);
            this.myVisualProp = { solid: { color: "white" } };
        }

        public update(options: VisualUpdateOptions) {

            //this.target.innerHTML = `<p>Update count: <em>${(this.updateCount++)}</em></p>`;
            d3.select('rect').remove()
            d3.select('circle').remove()

            let region1;
            let actual1;
            let target1;
            let Threshold;
            //debugger;
            // code to map variable to input parameters values

            if (options.dataViews[0].categorical.values[0] != undefined) {
                actual1 = Number(options.dataViews[0].categorical.values[0].values[0]);
            }
            if (options.dataViews[0].categorical.values[1] != undefined) {
                target1 = Number(options.dataViews[0].categorical.values[1].values[0]);
            }
            if (options.dataViews[0].categorical.values[2] != undefined) {
                Threshold = Number(options.dataViews[0].categorical.values[2].values[0]);
            }
            // if (options.dataViews[0].categorical.categories != undefined)
            // {
            //     region1 = options.dataViews[0].categorical.categories[0].values[0];
            // }

            //let region1 = options.dataViews[0].categorical.categories[0].values[0];
            //let actual1 = Number(options.dataViews[0].categorical.values[0].values[0]);
            //let target1 = Number(options.dataViews[0].categorical.values[1].values[0]);
            //let min = Number(options.dataViews[0].categorical.values[2].values[0]);
            //let max = Number(options.dataViews[0].categorical.values[3].values[0]);  

            // code to get the total width and height of our canvas after resizing
            let optionsWidth = options.viewport.width;
            let optionsHeight = options.viewport.height;

            // code to resize svg-element

            this.svg
                .attr("width", optionsWidth)
                .attr("height", optionsHeight);

            var fontSize = 0.06 * d3.min([optionsHeight, optionsWidth]); // to dynamically adjust font-size
            //var fontSize = 50*optionsHeight/optionsWidth;

            if (options.dataViews[0].metadata.objects) {
                if (options.dataViews[0].metadata.objects["myColor"]["myRectangleColour"] != undefined) {
                    this.myVisualProp = options.dataViews[0].metadata.objects["myColor"]["myRectangleColour"];
                }
                else {
                    this.myVisualProp = { solid: { color: "Grey" } };
                }
                this.myVisualPropmyLineThickness = <number>options.dataViews[0].metadata.objects["myColor"]["myLineThickness"];

                if (options.dataViews[0].metadata.objects["myColor"]["myMin"] != undefined) {
                    this.myMin = <number>options.dataViews[0].metadata.objects["myColor"]["myMin"];
                }
                else {
                    this.myMin = <number>-5;
                }
                if (options.dataViews[0].metadata.objects["myColor"]["myMax"] != undefined) {
                    this.myMax = <number>options.dataViews[0].metadata.objects["myColor"]["myMax"];
                }
                else {
                    this.myMax = <number>0;
                }

                if (options.dataViews[0].metadata.objects["myColor"]["myMetricFormat"] != undefined) {
                    this.myMetricFormat = options.dataViews[0].metadata.objects["myColor"]["myMetricFormat"];
                }
                else {
                    this.myMetricFormat = "$";
                }
                if (options.dataViews[0].metadata.objects["myColor"]["myDecimal"] != undefined) {
                    this.myDecimal = <number>options.dataViews[0].metadata.objects["myColor"]["myDecimal"];
                }
                else {
                    this.myDecimal = <number>1;
                }
                if (options.dataViews[0].metadata.objects["myColor"]["myNumberSize"] != undefined) {
                    this.myNumberSize = <number>options.dataViews[0].metadata.objects["myColor"]["myNumberSize"];
                }
                else {
                    this.myNumberSize = <number>8;
                }
                if (options.dataViews[0].metadata.objects["myColor"]["myDisplayUnits"] != undefined) {
                    this.myDisplayUnits = options.dataViews[0].metadata.objects["myColor"]["myDisplayUnits"];
                }
                else {
                    this.myDisplayUnits = "Auto";
                }

                if (options.dataViews[0].metadata.objects["myColor"]["myTargetHideShow"] != undefined) {
                    this.myTargetHideShow = <boolean>options.dataViews[0].metadata.objects["myColor"]["myTargetHideShow"];
                }
                else {
                    this.myTargetHideShow = <boolean>false;
                }

                if (options.dataViews[0].metadata.objects["myColor"]["vBehavior"] != undefined) {
                    this.myBehavior = <boolean>options.dataViews[0].metadata.objects["myColor"]["vBehavior"];
                }
                else {
                    this.myBehavior = <boolean>false;
                }
                if (options.dataViews[0].metadata.objects["myColor"]["vShowArrow"] != undefined) {
                    this.myShowArrow = <boolean>options.dataViews[0].metadata.objects["myColor"]["vShowArrow"];
                }
                else {
                    this.myShowArrow = <boolean>false;
                }
                if (options.dataViews[0].metadata.objects["myColor"]["myKPIColorDynamic"] != undefined) {
                    this.myKPIColorDynamic = <boolean>options.dataViews[0].metadata.objects["myColor"]["myKPIColorDynamic"];
                }
                else {
                    this.myKPIColorDynamic = <boolean>false;
                }


            }
            else {
                //this.myVisualProp = { solid: { color: "white" } };
                this.myVisualPropmyLineThickness = <number>5;
                this.myMin = <number>-5;
                this.myMax = <number>0;
                this.myMetricFormat = "$";
                this.myDecimal = <number>1;
                this.myNumberSize = <number>8;
                this.myDisplayUnits = "Auto";
                this.myTargetHideShow = <boolean>false;
                this.myBehavior = <boolean>false;
                this.myShowArrow = <boolean>false;

            }

            let min = this.myMin;
            let max = this.myMax;

            // code for dynamic font-size and font-color of our data depending on variance and direction and color of arrow
            var color1: string;
            var color2: string;
            var size1: string;
            var imageurl: string;
            //var x = (actual1/target1)*100;            
            var x = actual1;
            var y = target1;
            var z = Threshold;
            if (this.myBehavior) {
                if (x <= y) {
                    color1 = "black";
                    size1 = '10px';
                    imageurl = 'https://cdn3.iconfinder.com/data/icons/musthave/256/Stock%20Index%20Up.png';
                }
                else if (x > y) {
                    color1 = "black";
                    size1 = '10px';
                    imageurl = 'https://cdn3.iconfinder.com/data/icons/musthave/256/Stock%20Index%20Down.png';
                }
            }
            else {
                if (x >= y) {
                    color1 = "black";
                    size1 = '10px';
                    imageurl = 'https://cdn3.iconfinder.com/data/icons/musthave/256/Stock%20Index%20Up.png';
                }
                else if (x < y) {
                    color1 = "black";
                    size1 = '10px';
                    imageurl = 'https://cdn3.iconfinder.com/data/icons/musthave/256/Stock%20Index%20Down.png';
                }
            }
            if (z == 1) {
                color2 = "Green";
            }
            else if (z == 2) {
                color2 = "yellow";
            }
            else if (z == 3) {
                color2 = "Red";
            }
            else {
                color2 = "white"
            }
            if (this.myKPIColorDynamic) {
                //color1 = this.myVisualProp.solid.color;
            }
            else {
                color1 = this.myVisualProp.solid.color;
            }
            // if (number < 1000) {
            //     var hundred = number % 100;
            //     var remainerHundred = numberToWords(hundred, unit);
            //     var hundreds = Math.floor(number / 100);
            //     var topHundred = words[hundreds];
            //     wordVal = topHundred + " hundred " + remainerHundred;
            // }

            //   debugger;
            //actual1=5566609.63;
            let Result: any;
            let Goal: any;
            if (this.myMetricFormat == "%") {
                Result = (Number(actual1 * 100)).toFixed(this.myDecimal) + " %";
                Goal = (Number(target1 * 100)).toFixed(this.myDecimal) + " %"
            }
            else if (this.myMetricFormat == "P") {
                Result = (Number(actual1 * 100)).toFixed(this.myDecimal);
                Goal = (Number(target1 * 100)).toFixed(this.myDecimal);
            }
            else {
                if (this.myDisplayUnits == "Auto") {
                    //thousands
                    if (actual1 > 1000 && actual1 < 1000000) {
                        // Three Zeroes for Thousands
                        Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+3).toFixed(this.myDecimal) + " K"
                        Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+3).toFixed(this.myDecimal) + " K"
                    }
                    //millions
                    else if (actual1 < 1000000000) {
                        Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+6).toFixed(this.myDecimal) + " M";
                        Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+6).toFixed(this.myDecimal) + " M";
                    }
                    //billions
                    else if (actual1 < 1000000000000) {
                        Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+9).toFixed(this.myDecimal) + " bn";
                        Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+9).toFixed(this.myDecimal) + " bn";
                    }
                    //Trillions
                    else if (actual1 < 1000000000000000) {
                        Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+12).toFixed(this.myDecimal) + " T";
                        Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+12).toFixed(this.myDecimal) + " T";
                    }
                    else {
                        Result = this.myMetricFormat + " " + (Number(actual1)).toFixed(this.myDecimal);
                        Goal = this.myMetricFormat + " " + (Number(target1)).toFixed(this.myDecimal);
                    }
                }
                else if (this.myDisplayUnits == "None") {
                    Result = this.myMetricFormat + " " + (Number(actual1)).toFixed(this.myDecimal);
                    Goal = this.myMetricFormat + " " + (Number(target1)).toFixed(this.myDecimal);
                }
                else if (this.myDisplayUnits == "Thousands") {
                    Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+3).toFixed(this.myDecimal) + "K";
                    Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+3).toFixed(this.myDecimal) + "K";
                }
                else if (this.myDisplayUnits == "Millions") {
                    Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+6).toFixed(this.myDecimal) + "M";
                    Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+6).toFixed(this.myDecimal) + "M";
                }
                else if (this.myDisplayUnits == "Billions") {
                    Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+9).toFixed(this.myDecimal) + "B";
                    Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+9).toFixed(this.myDecimal) + "B";
                }
                else if (this.myDisplayUnits == "Trillions") {
                    Result = this.myMetricFormat + " " + (Number(actual1) / 1.0e+12).toFixed(this.myDecimal) + "T";
                    Goal = this.myMetricFormat + " " + (Number(target1) / 1.0e+12).toFixed(this.myDecimal) + "T";
                }
            }
            // to add larger rectangle for representing data
            let rectangle1 = this.svg.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", optionsWidth)
                .attr("height", optionsHeight)
                //.attr("fill", this.myVisualProp.solid.color); // code to change color of rectangle dynamically
                .attr("fill", "#FFFFFF");

            //gst: to add names and values in tooltips

            /*          this.act = <string>options.dataViews[0].categorical.values[0].values[0];
                      this.tar = <string>options.dataViews[0].categorical.values[1].values[0];
                      this.tip = <string>options.dataViews[0].metadata.columns.filter(d=>d.roles)[0].displayName;
            */

            this.tooltips = [];
            let view = options.dataViews[0].categorical;
            let values = view.values[0];
            let columns = options.dataViews[0].metadata.columns;
            
            for (let i = 0, len = columns.length; i < len; i++) {

                let iValueFormatter = ValueFormatter.create({ format: columns[i].format });

                let value = (columns[i].type.text) ? "" + view.values[i].values[0] : (<number>view.values[i].values[0]).toFixed(this.myDecimal);
            
                this.tooltips.push(
                    {
                        displayName: <string>columns[i].displayName,
                        value: value,
                        header: "Custom Tooltips",
                        color: ""
                    })
                
            }
            //gst end

            // to add the Actuals values to KPI 
            if (this.myShowArrow) {
                let text2 = this.svg.append("text")
                    // to format, so that sales have prefix '$' sign    
                    .text(Result)
                    .attr("x", (optionsWidth) / 2)
                    .attr("y", this.myNumberSize * 3)
                    .attr("width", optionsWidth)
                    .attr("height", optionsHeight)
                    .attr("font-family", "Segoe UI")
                    .attr("font-size", this.myNumberSize * 2)
                    .attr("fill", color1)   // color change wrt variance
                    .attr("text-anchor", "middle")
                    //.style("font-weight",600)
                    //code for toolltip gst
                    .on("mouseover", (d) => {
                        let mouse = d3.mouse(this.svg.node());
                        let x = mouse[0];
                        let y = mouse[1];
                        this.host.tooltipService.show({
                            dataItems: this.tooltips,
                            identities: null,
                            coordinates: [x, y],
                            isTouchEvent: false

                        });
                    });
                //gst end */

                // code to add arrow image to svg 

                let img = this.svg.append('image')
                    .attr('xlink:href', imageurl)
                    .attr('class', 'pico')
                    .attr('height', this.myNumberSize * 2)
                    .attr('width', this.myNumberSize * 2)
                    .attr('x', optionsWidth * 0.7)
                    .attr('y', this.myNumberSize * 2);

                //threshold code 
                let rectangle1 = this.svg.append("rect")
                    .attr("x", 0)
                    .attr("y", optionsHeight * 3 / 4)
                    .attr("width", optionsWidth)
                    .attr("height", optionsHeight / 4)
                    .attr("fill", color2);

                // to add the Variance % values to KPI 
                if (target1 == 0) {
                    if (this.myTargetHideShow) {
                        let text3 = this.svg.append("text")
                            .text("%-NA" + " " + " |" + " " + "Target " + "(" + Goal + ")")
                            .attr("x", (optionsWidth) / 2)
                            .attr("y", this.myNumberSize * 7)
                            .attr("font-family", "Segoe UI")
                            .attr("font-size", this.myNumberSize * 2)
                            .attr("fill", 'white')
                            .attr("text-anchor", "middle")
                            .style("font-weight", "bold");
                    }

                }
                else {
                    if (this.myTargetHideShow) {
                        let text3 = this.svg.append("text")
                            .text(d3.round(((actual1 - target1) / target1) * 100, 1) + "%" + " " + " |" + " " + "Target " + "(" + Goal + ")")
                            .attr("x", (optionsWidth) / 2)
                            .attr("y", this.myNumberSize * 7)
                            .attr("font-family", "Segoe UI")
                            .attr("font-size", this.myNumberSize * 1.25)
                            .attr("fill", 'black')
                            .attr("text-anchor", "middle")
                            .style("font-weight", "bold");
                    }
                }

            }
            else {
                let text2 = this.svg.append("text")
                    // to format, so that sales have prefix '$' sign    
                    .text(Result)
                    .attr("x", (optionsWidth) / 2)
                    .attr("y", this.myNumberSize * 5)
                    //.attr("width", optionsWidth)
                    //.attr("height", optionsHeight)
                    .attr("font-family", "Segoe UI")
                    .attr("font-size", this.myNumberSize * 4)
                    .attr("fill", color1)   // color change wrt variance
                    .attr("text-anchor", "middle")
                    .style("font-weight", 700)
                    //code for toolltip gst
                    .on("mouseover", (d) => {
                        let mouse = d3.mouse(this.svg.node());
                        let x = mouse[0];
                        let y = mouse[1];
                        this.host.tooltipService.show({
                            dataItems: this.tooltips,
                            identities: null,
                            coordinates: [x, y],
                            isTouchEvent: false
                        });
                    });
                //gst end */

                // to add the Variance % values to KPI 
                if (target1 == 0) {
                    if (this.myTargetHideShow) {
                        let text3 = this.svg.append("text")
                            .text("%-NA" + " " + " |" + " " + "Target " + "(" + Goal + ")")
                            .attr("x", (optionsWidth) / 2)
                            .attr("y", this.myNumberSize * 7)
                            .attr("font-family", "Segoe UI")
                            .attr("font-size", this.myNumberSize * 1.25)
                            .attr("fill", 'black')
                            .attr("text-anchor", "middle")
                            .style("font-weight", "bold");
                    }

                }
                else {
                    if (this.myTargetHideShow) {
                        let text3 = this.svg.append("text")
                            .text(d3.round(((actual1 - target1) / target1) * 100, 1) + "%" + " " + " |" + " " + "Target " + "(" + Goal + ")")
                            .attr("x", (optionsWidth) / 2)
                            .attr("y", this.myNumberSize * 7)
                            .attr("font-family", "Segoe UI")
                            .attr("font-size", this.myNumberSize * 1.25)
                            .attr("fill", 'black')
                            .attr("text-anchor", "middle")
                            .style("font-weight", "bold");
                    }
                }

            }


        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let objectName = options.objectName;
            let objectEnumeration: VisualObjectInstance[] = [];

            switch (objectName) {
                case "myColor":
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            //myRectangleColour: { solid: { color: this.myVisualProp } },
                            // myLineColour: { solid: { color: this.lineSettings.myLine.myLineThickness } }
                            // myLineThickness: this.lineSettings.myLine.myLineThickness,
                            myKPIColorDynamic: this.myKPIColorDynamic,
                            myRectangleColour: this.myVisualProp.solid.color,
                            //myLineThickness: this.myVisualPropmyLineThickness,
                            //myMin: this.myMin,
                            //myMax: this.myMax,
                            myMetricFormat: this.myMetricFormat,
                            myDecimal: this.myDecimal,
                            myNumberSize: this.myNumberSize,
                            myDisplayUnits: this.myDisplayUnits,
                            myTargetHideShow: this.myTargetHideShow,
                            vBehavior: this.myBehavior,
                            vShowArrow: this.myShowArrow,
                        },
                        validValues: {
                            myLineThickness: {
                                numberRange: {
                                    min: 1,
                                    max: 10
                                }
                            }
                        },
                        selector: null
                    });
                    break;
            };
            return objectEnumeration;

        }

    }

}