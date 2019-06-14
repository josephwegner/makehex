class AddMapAccessCode < ActiveRecord::Migration[5.1]
  def change
    add_column :maps, :access_code, :string
    add_index :maps, :access_code, unique: true

    create_table(:players) do |t|
      t.column :code, :string
      t.index :code
      t.column :token_color, :string
      t.column :token_label, :string
      t.references :map
      t.references :user
    end

    used_tokens = []
    Map.all.each do |m|
      token = loop do
        random_token = SecureRandom.alphanumeric(5).downcase
        break random_token unless used_tokens.include?(random_token)
      end

      m.access_code = token
      m.save!
    end
  end
end
