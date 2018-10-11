# Hexamagon

Hexamagon is a live-play hex mapping tool. It excells at creating low-fideltiy hex-based maps that can be used in real-time during your gaming sessions to give players a clear and immersive experience of the game.

## Hosting

A key component of Hexmagon is its ability to be run and hosted easily by players that are so inclined. You can certainly create maps using our [hosted service](https://hexamagon.joewegner.com), but you are also more than welcome to host elsewhere and manage the tool yourself. There are a few components and configuration you should understand when setting up a Hexamagon instance.

If you're lucky, you can kick off the app with two simple commands:

```
bundle install
bundle exec db:create
foreman start
```

Those obviously rely on [bundler](https://bundler.io/) and [foreman](https://github.com/strongloop/node-foreman) being installed. If it isn't quite that easy, read on for some more specifics.

### Web App

The main web app is a Ruby on Rails app. It uses the Puma webserver to provide high-performance request handling. You will need to kick off the web server as the main component.

```
RAILS_ENV=production bundle exec rails s
```

### Sidekiq

In order to avoid overloading the database with tons of updates, Hexamagon batches layout updates and commits them via a background worker called [Sidekiq](https://github.com/mperham/sidekiq). Again, Sidekiq is a Ruby library, so you will definitely need Ruby installed.

```
bundle exec sidekiq
```

### Redis

Hexamagon relies on Redis for many things. From websockets, to sidekiq jobs, to caching tile updates, Redis is absolutely critical. I won't get into the intricacies here of running [Redis](https://redis.io/), but I'd recommend spending some time getting it right. It's a core piece of Hexamagon, and it being performant will be very valuable.

Redis is usually started with
```
redis-server
```

### Postgres

Behind the scenes, keeping all of ur data safe and happy, is [Postgres](https://www.postgresql.org/). There is not much to say here - you'll need a Postgres instance.

Postgres is usually started with
```
pg_ctl -D /usr/local/var/postgres start
```

## Contributing

All of the above in the Hosting section is likely a good read if you are intending to do some development, but I would _very_ strongly recommend investing in getting `foreman` working if you can - it saves a lot of dev time. If you can make it work, just start everything up with:

```
foreman -f Procfile.local
```
