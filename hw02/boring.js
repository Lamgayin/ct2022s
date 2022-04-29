/***/
/** 建一個canvas畫布*/
/***/
function createGlyphCanvas(glyph, size) {
    var canvasId, html, glyphsDiv, wrap, canvas, ctx;
    //canvasId = "c" + glyph.index;
    canvasId = "cid";
    html =
        '<div class="wrapper" style="width:' +
        size +
        'px"><canvas id="' +
        canvasId +
        '" width="' +
        size +
        '" height="' +
        size +
        'display="inline-block""></canvas>';
    glyphsDiv = document.getElementById("svg_image");
    glyphsDiv.innerHTML = html;
    canvas = document.getElementById(canvasId);
    ctx = canvas.getContext("2d");
    return ctx;
}

/** create font svg function */
function create_font_svg() {
    /** Your code goes here */
    if (openTypeFont !== null) {
        d3.select("#svg_image").html("");
        d3.select("#svg_text").html("");
        var str = String.fromCodePoint(code_point);
        var font = openTypeFont;
        var glyph = font.stringToGlyphs(str)[0];
        var ctx = createGlyphCanvas(glyph, 140);
        var x = 10;
        var y = 120;
        var fontSize = 120;

        var check_status = document.getElementById("point-switch").checked;
        if (check_status == false) {
            glyph.draw(ctx, x, y, fontSize);
        }
        if (check_status == true) {
            glyph.draw(ctx, x, y, fontSize);
            glyph.drawPoints(ctx, x, y, fontSize);
        }

        var mkPath = function (commands, height) {
            var p = new MyPath();
            var c = [];
            for (let i = 0; i < commands.length; i += 1) {
                const cmd = commands[i];
                if (cmd.type === "M") {
                    p.moveTo(cmd.x, height - cmd.y);
                    c.push([cmd.x, height - cmd.y]);
                } else if (cmd.type === "L") {
                    p.lineTo(cmd.x, height - cmd.y);
                    c.push([cmd.x, height - cmd.y]);
                    c.push([cmd.x - 1, height - cmd.y - 1]);
                } else if (cmd.type === "Q") {
                    p.quadraticCurveTo(
                        cmd.x1,
                        height - cmd.y1,
                        cmd.x,
                        height - cmd.y
                    );
                    c.push([cmd.x1, height - cmd.y1]);
                    c.push([cmd.x, height - cmd.y]);
                } else if (cmd.type === "C") {
                    p.curveTo(
                        cmd.x1,
                        height - cmd.y1,
                        cmd.x2,
                        height - cmd.y2,
                        cmd.x,
                        height - cmd.y
                    );
                    c.push([cmd.x1, height - cmd.y1]);
                    c.push([cmd.x2, height - cmd.y2]);
                    c.push([cmd.x, height - cmd.y]);
                } else if (cmd.type === "Z") {
                    p.closePath();
                }
            }
            return [p, c];
        };
        var svgPathObj = mkPath(glyph.path.commands, font.unitsPerEm);
        var tmpPath = svgPathObj[0];
        var svg3 = d3
            .select("#svg_image")
            .append("svg")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("xmlns:svg", "http://www.w3.org/2000/svg")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .style("visibility", "hidden");
        svg3
            .append("path")
            .attr("d", tmpPath.toPathData())
            .attr("class", "font-svg");
        d3.select("#svg_text").html(svg3.node().outerHTML);
        svgHTML = svg3.node().outerHTML;
    }

    console.log("end create_font_svg()...");
}
/***/