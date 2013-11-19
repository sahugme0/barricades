define(['vec2d', 'lodash', 'PhysConst', 'screenProjection', 'geometry'], function (v, _, PhysConst, screenProjection, geometry) {

    function World() {
        this.bodies = [];
    }

    World.prototype.addBody = function (body) {
        this.bodies.push(body);
    };

    World.prototype.removeBody = function (body) {
        _.pull(this.bodies, body);
    };

    World.prototype.update = function (dt) {
        var world = this;

        for (var i = 0; i < world.bodies.length; i++) {
            var body = world.bodies[i];
          
            for (var j = i+1; j < world.bodies.length; j++) {
                var other = world.bodies[j];

                var results = geometry.collide(body.verts(), other.verts());                    
                body.colliding = other.colliding = results[0];
                if (results[0]) {
                    console.log("collision! " + i + " " + j);
                    console.log(body);
                    console.log(other);
                    other.vel.add(v(results[1].overlapV.x, results[1].overlapV.y));
                    body.vel.add(v(results[1].overlapV.x, results[1].overlapV.y).scale(-1)); 
                }
            }

            body.update(dt);

            body.pos.y = screenProjection.wrap(body.pos.y);

        }
        
    };


    World.prototype._drawReticules = function (ctx, perspective) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        var reticules = 8;
        var retSep = PhysConst.viewPort.height / reticules;

        for (var i = 0; i < reticules; i++) {
            var pos = retSep*i + screenProjection.mod(0 - perspective.y, retSep);
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(PhysConst.viewPort.width, pos);
            ctx.closePath();
            ctx.stroke();
        }

        for (var i = 0; i < (PhysConst.viewPort.width / retSep); i++) {
            var pos = retSep*i;
            ctx.beginPath();
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, PhysConst.viewPort.height);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    }

    World.prototype.draw = function (ctx, perspective) {
        this._drawReticules(ctx, perspective);

        _.each(this.bodies, function (body) {
            body.draw(ctx, perspective);
        });
    }

    return World;

});
