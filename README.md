# Serverless feature flags

The idea behind this is to add feature flags API that will utilise [Serverless framework](https://serverless.com/).

## Schema

The idea for the initial basic schema will be following:
```
{
  featureName1: {
    state: true|false
  }
}
```

## Todo
 - [x] Set up DynamoDB in `serverless.yml` - that is where the data will be persisted
 - [x] GET endpoint that will return a list of enabled features as defined in schema
 - [ ] Write object transform array reducer for the object from DynamoDB to match the response schema
 - [ ] Cloudfront - configure the cache time for a very long time
 - [ ] Add a clear cache trigger when the DynamoDB is update - feature is added/removed/updated
