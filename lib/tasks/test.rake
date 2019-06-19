if ENV['CI_NODE_INDEX'] == '1'
  exec 'npm run test'
else
  exec 'rspec'
end
