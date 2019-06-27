// Handy tools  that I use locally. Not intended to be used in actual live code

function hexPoint(center, size, i) {
  var angle_deg = 60 * i - 30;
  var angle_rad = Math.PI / 180 * angle_deg
  return {
    x: center.x + size * Math.cos(angle_rad),
    y: center.y + size * Math.sin(angle_rad)
  }
}

function hexPoints(center, size) {
  return [0,1,2,3,4,5].map(i => {
    return hexPoint(center, size, i)
  })
}

function offsetCorners(points, radius) {
  if (!radius) {
    radius = .1
  }
  var distance = Math.sqrt(Math.pow((points[0].x - points[1].x), 2) + Math.pow((points[0].y - points[1].y), 2))
  var offset = distance * radius

  var corners = []
  points.forEach((point, i) => {
    var pointDegrees = 60 * i - 30
    var previousPointDegrees = Math.PI / 180 * (pointDegrees - 120)
    var nextPointDegrees = Math.PI / 180 * (pointDegrees + 120)

    var pdx = offset * Math.cos(previousPointDegrees)
    var pdy = offset * Math.sin(previousPointDegrees)
    var ndx = offset * Math.cos(nextPointDegrees)
    var ndy = offset * Math.sin(nextPointDegrees)

    corners.push([{x: point.x + pdx, y: point.y + pdy},
    point,
    {x: point.x + ndx, y: point.y + ndy}])
  })

  return corners
}

function pointsToPath(points) {
  var path =
`M${points[0].x} ${points[0].y}
`
  points.slice(1).forEach(p => {
    path += `${p.x} ${p.y}\n`
  })
  path += 'z'
  return path
}

function pointsToRoundedPath(points) {
  var path =
`M${points[0][0].x} ${points[0][0].y}
Q${points[0][1].x} ${points[0][1].y} ${points[0][2].x} ${points[0][2].y}
`
  points.slice(1).forEach(corner => {
    path +=
`L${corner[0].x} ${corner[0].y}
Q${corner[1].x} ${corner[1].y} ${corner[2].x} ${corner[2].y}
`
  })
  path += 'z'
  return path
}
