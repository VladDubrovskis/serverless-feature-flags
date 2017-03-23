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
 - [x] Write object transform array reducer for the object from DynamoDB to match the response schema
 - [x] Handler to use the response transform
 - [x] Change the directory structure: add "api" folder with "get", "put", etc. handlers
 - [x] Add POST handler - to add flag to DynamoDB
 - [ ] POST handler - add check to see if a flag is already in the table, if so, throw error. Otherwise it would get overwritten
  - [ ] Make use of AWS-SDK [promises](https://aws.amazon.com/blogs/developer/support-for-promises-in-the-sdk/) rather than callbacks
  - [ ] Fix failing unit test
 - [ ] Add PUT handler - to update flag in DynamoDB
 - [ ] Add DELETE hander - to delete flag from DynamoDB
 - [ ] Add authentication mechanism for adding/removing/deleting features
 - [ ] Cloudfront - configure the cache time for a very long time
 - [ ] Add a clear cache trigger when the DynamoDB records is added/removed/updated
 - [ ] Think of authentication mechanism for adding/removing/deleting features - for initial working scenario document and possibly add some scripts to talk to DynamoDB via AWS-SDK
 - [ ] Document and possibly try to automate attaching a domain name

## Long term ideas
 - [ ] Explore how this can be integrated with MVT frameworks, and what it takes to build one
