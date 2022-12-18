class rayMarching {
    constructor(x, y, angle) {
        this.x = x
        this.y = y
        this.startX = x
        this.startY = y
        this.angle = angle
        this.r = 1
        this.done = false;
        this.elementDone = {};
        this.elementType = '';

        // this.#minDist = 200
    }

    // create corresponding shape
    createLine(x1, y1, x2, y2) {
        let lineObj = { x1: x1, y1: y1, x2: x2, y2: y2 }
        return lineObj
    }
    createRect(x1, y1, x2, y2) {
        let rectObj = { x1: x1, y1: y1, x2: x2, y2: y2 }
        return rectObj

    }
    createCircle(x, y, r) {
        let circleObj = { x: x, y: y, r: r }
        return circleObj

    }


    // check the distance from a point to another point
    distance(x1, y1, x2, y2) {
        let d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        return d;
    }

    //check the distance from a point to a circle
    distanceDotToCircle(x1, y1, x2, y2, r1) {
        return this.distance(x1, y1, x2, y2) - r1
    }


    // check the distance between rectangle and dot
    distanceDotToRectangle(x1, y1, x2, y2, xDot, yDot) {
        var dx = Math.max(x1 - xDot, 0, xDot - x2);
        var dy = Math.max(y1 - yDot, 0, yDot - y2);
        return Math.sqrt(dx * dx + dy * dy);

    }

    // check the distance between dot and line(thank to Joshua)
    distanceDotToLine(x1, y1, x2, y2, xDot, yDot) {

        var A = xDot - x1;
        var B = yDot - y1;
        var C = x2 - x1;
        var D = y2 - y1;

        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;

        var xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        var dx = xDot - xx;
        var dy = yDot - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }


    
    /// <summary> 
    /// this will start tracing the angle. you have to first init this before anything else.
    /// e.g ray.startTracing([circlesObh array], [rectangleObj array], [lineObj array], an element you want it to skip over)
    /// </summary> 
    startTracing(circleArray, squareArray, linesArray, skipElement) {
        linesArray = linesArray || 0
        squareArray = squareArray || 0
        circleArray = circleArray || 0
        let maxDist = 10
        let SmallestDistance = maxDist
        let counter = 0
        while (!this.done) {



            // check for the distance from every circle
            // every for loop checks for the distance for every shape and checks if its the closest if so it sets Smallest Distance variable to said distance
            for (let i = 0; i < circleArray.length; i++) {
                const element = circleArray[i];
                const d = this.distanceDotToCircle(element.x, element.y, this.x, this.y, element.r)
                if (SmallestDistance > d && skipElement != element) {
                    SmallestDistance = d
                    this.elementType = 'circle';
                    this.elementDone = element;

                }
            }
            // check for distance to every rectangles
            for (let i = 0; i < squareArray.length; i++) {
                const element = squareArray[i];
                const d = this.distanceDotToRectangle(element.x1, element.y1, element.x2, element.y2, this.x, this.y)
                if (SmallestDistance > d && skipElement != element) {
                    SmallestDistance = d
                    this.elementType = 'rectangle';
                    this.elementDone = element;

                }
            }
            // check for distance to every rectangles
            for (let i = 0; i < linesArray.length; i++) {
                const element = linesArray[i];
                const d = this.distanceDotToLine(element.x1, element.y1, element.x2, element.y2, this.x, this.y);
                if (SmallestDistance > d && skipElement != element) {
                    SmallestDistance = d
                    this.elementType = 'line';
                    this.elementDone = element;
                }
            }




            if (SmallestDistance <= 0 || SmallestDistance >= 12) {
                this.done = true
            }
            // if the loop is too long and makes your game get stuck this should stop the loop
            counter++;

            if (counter >= 600) {
                this.done = true;
            }

            // after checking for the closest thing to the ray it will move that distance in the angle set to it
            this.x += cos(radians(this.angle)) * SmallestDistance;
            this.y += sin(radians(this.angle)) * SmallestDistance;

        }

        // return the pos (e.g. [0]) end and the start pos (e.g. [1])
        return { position: { x: this.x, y: this.y }, startPosition: { x: this.startX, y: this.startY }, elementDone: this.elementDone, elementType: this.elementType }



    }
    /// <summary> 
    /// calculates the angle of bounce (only in circles currently) 
    /// bounce([The return object of the trace function])
    /// DISCLAIMER: Run this only after running the start tracing function since it uses the return of the start tracing function
    /// </summary> 
    bounce(ray) {

        if(ray.elementType == 'circle'){

            let circleX = ray.elementDone.x;
            let circleY = ray.elementDone.y;
            const normal = createVector(this.x - circleX, this.y - circleY);
            let normalToRay = createVector(this.startX - this.x, this.startY - this.y).angleBetween(createVector(normal.x, normal.y));
            let normalToX = createVector(normal.x, normal.y).angleBetween(createVector(circleX, 0));
            if (normalToX < 0) {
                return degrees(normalToRay + abs(normalToX))
            }
            else {
                return degrees(normalToRay - abs(normalToX))
            }        
        }

        
    }

    
    /// <Summary> 
    /// draws the ray
    /// 
    /// DISCLAIMER: Run this only after running the start tracing function since it uses the return of the start tracing function
    /// </Summary> 
    drawRay(ray){

        if(ray == {} || ray === 'undefined') return;
        line(ray.elementDone.position.x, ray.elementDone.position.y, ray.elementDone.startPosition.x, ray.elementDone.startPosition.y)
    }



}