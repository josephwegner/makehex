class ArrayGridsToHash < ActiveRecord::Migration[5.1]
  def change
    Layout.all.each do |l|
      if l.grid.kind_of?(Array)
        l.grid = {}
        l.save
      end
    end
  end
end
