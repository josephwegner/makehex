namespace :tests do
  desc 'Run tests'
  task :run do
    puts "CI_NODE_INDEX is #{ENV['CI_NODE_INDEX']}"

    if ENV['CI_NODE_INDEX'] == '1'
      Rake::Task["tests:mocha"].invoke
    else
      Rake::Task["tests:rspec"].invoke
    end
  end

  desc 'Run front-end tests'
  task :mocha do
    puts 'running front-end tests'
    exec 'yarn run test'
  end

  desc 'Run back-end tests'
  task :rspec do
    puts 'running rspec tests'
    exec 'rspec'
  end
end

task :test => 'tests:run'
