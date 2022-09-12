# Backend Challenge 

## Requirements:

Design and implement a RESTful API which exposes two resources:
- `/traces` will return information associated with an IP address.
- `/statistics` will return metrics about `/traces` usage.

To see exercise's full requirements description check the following [PDF](https://github.com/maurocasciati/c003-ipcheck/blob/master/requirements.pdf).

## Brief overview:

Both resources are located directly in `AppModule`'s controller. And it's `AppModule`'s service delegates responsibility to the service layer, which comunicates with the api clients and redis module. 
- Services:
  - The `StatisticsService` is in charge of saving, calculating and retrieving `/traces` metrics usage. It informs the most traced country and the longest distance from requested traces.
  - The `TracesService` is the one that connects with the external services throught the api clients, and manage the information to retrieve it as required.
- Api Clients:
  - [IpApi](https://ip-api.com/) is used to fetch IP information.
  - [ApiLayer's Fixer API](https://fixer.io/) retrieves currency conversion rates to fulfill that information.
- `RedisModule` uses [NestJS cache manager](https://www.npmjs.com/package/cache-manager) with [Redis](https://redis.io/) as a data store to persist metric's information and a cache to avoid multiple identicall calls to an external api.

## Running the app:

First of all, [Redis](https://redis.io/) needs to be installed and running to use this service. After download, you can start Redis server with the following command:

```bash
redis-server
```

You will also need to install [NodeJS](https://nodejs.org/en/download/). To run the service use the command: 

```bash
npm run start
```

## Using the app:

1. Call `POST` `/traces` to retrieve information about an IP:

```bash
curl --location --request POST 'localhost:3000/traces' \
--header 'Content-Type: application/json' \
--data-raw '{
    "ip": "19.174.138.136" 
}'
```

2. To check `/statistics`, just do the following `GET` call:

```bash
curl --location --request GET 'localhost:3000/statistics'
```

## Key decisions:
1. To store statistics I decided to go for *Redis* since is a super fast in memory storage that can also be persisted. `most_traced` metrics are saved in a hash set cause it takes less memory space and it's `set` method (which will be called every time `/traces` is called) is O(1). `longest_distance` is calculated using [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula) and it's being persisted in two different keys, one for country's name and the other one for the value (and performance worst case scenario is O(3)).

2. Since the service is suposed to run in a high-concurrency environment, performance is key. For that, I used Redis again to *cache* FixerAPI responses for an hour, which was the slowest of both external APIs. Also, Redis calls are being made in parallel when possible.

3. I found a way to have a little more resiliency by not fully depending on FixerAPI. When it's call fails, the service continues working and retrieves a null value instead of that specific rate. I also wanted to apply a retry resiliency pattern in both external API's but I haven't had the time to do it.

4. **Note:** None of both external APIs retrieves the currency symbol. I assumed it was updated and after the requirements were made and I didn't added any other API for that use. I'm retireving a empty string in those cases.

5. **Note:** I haven't had much time to present the exercise as I wanted to. I would have added tests, a validation for the request, more error handling, etc. And I wanted to read and investigate more about resilience and high concurrency environments to apply other patterns too.
