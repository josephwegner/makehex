=begin
var coords = {}
coords.r =  Math.floor(this.index  / this.gridWidth)
var qOffset = Math.ceil(coords.r / -2)
coords.q = (this.index % this.gridWidth) + qOffset
return coords
=end
class GridCellsToHash < ActiveRecord::Migration[5.1]
  def up
    change_column_default :layouts, :grid, from: [], to: {}
    Layout.all.each do |l|
      grid = {}
      if !l.grid.nil?
        l.grid.each_with_index do |cell, index|
          next if cell.nil?

          r = (index / l.width).floor
          qOffset = (r / -2.to_f).ceil
          q = (index % l.width) + qOffset

          if !grid.has_key?(q)
            grid[q] = {}
          end

          grid[q][r] = cell
        end
      end

      l.grid = grid
      l.save
    end
  end

# var index = (layout.width * hex.r) + Math.floor(hex.r / 2) + hex.q

  def down
    change_column_default :layouts, :grid, from: {}, to: []
    Layout.all.each do |l|
      grid = []
      l.grid.each do |q, cells|
        cells.each do |r, cell|
          index = (l.width * r.to_i) + (r.to_i / 2).floor + q.to_i
          grid[index] = cell
        end
      end

      l.grid = grid
      l.save
    end
  end
end
