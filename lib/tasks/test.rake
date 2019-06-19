puts "CI_NODE_INDEX is #{ENV['CI_NODE_INDEX']}"

if ENV['CI_NODE_INDEX'] == '1'
  puts 'running front-end tests'
  exec 'npm run test'
else
  puts 'running rspec tests'
  exec 'rspec'
end
