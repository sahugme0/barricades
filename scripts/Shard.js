define(['vec2d','PhysConst', 'screenProjection', 'lodash'], function (v, PhysConst, screenProjection, _) {

  function Shard(position, orientation, verticies) {
    this.pos = position; // vector (pixels, pixels)
    this.ori = orientation; // radians
    this.vel = v(-3,3); // pixels per second

    var s = PhysConst.tank.scale;
    //    this.verticies = [ v(-s,s), v(-s,-s), v(s,-s), v(s,s) ];
    this.verticies = [v(s,s), v(s,-s), v(-s,-s), v(-s,s)];
  }

  Shard.prototype.serialize = function () {
    var plain = _.pick(this, 'id', 'pos', 'ori', 'rot', 'acc');
    var pos = { 'x': this.pos.x, 'y': this.pos.y };
    plain.pos = pos;
    plain.type = "shard";
    return plain;
  };

  Shard.prototype.verts = function () {
    var rotation = v.unit(this.ori);
    
    var verts = _.map(this.verticies, function (vert) {
      return vert.rotated(rotation);
    });

    return [this.pos].concat(verts);
  };

  Shard.prototype.update = function (dt) {
    this.vel.scale(1 - (PhysConst.tank.dragLoss / dt));
    this.pos.add(this.vel);
  };

  Shard.prototype.vroom = function (x) {
  };

  Shard.prototype.draw = function (ctx, perspective) {
    ctx.save();

    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;        

    var screenPosition = screenProjection.projectScreen(perspective, this.pos);
    ctx.translate(screenPosition.x, screenPosition.y);

    ctx.beginPath();
    ctx.moveTo(this.verticies[0].x, this.verticies[0].y);
    _.each(_.rest(this.verticies), function (vert) {
      ctx.lineTo(vert.x, vert.y);
    });
    ctx.closePath();

    ctx.stroke();
    ctx.fill();

    ctx.restore();
  };

  return Shard;
});
