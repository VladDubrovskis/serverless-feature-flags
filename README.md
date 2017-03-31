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
 - [x] POST handler - add check to see if a flag is already in the table, if so, throw error. Otherwise it would get overwritten
  - [x] Make use of AWS-SDK [promises](https://aws.amazon.com/blogs/developer/support-for-promises-in-the-sdk/) rather than callbacks
  - [x] Fix failing unit test
 - [ ] Refactor the callbacks - repeated code all over the place
 - [x] Update the response HTTP error codes
 - [ ] Add PUT handler - to update flag in DynamoDB
 - [x] Refactor the method that checks if returned value is empty plain object - either move to own module to make DRY or use lodash?
 - [ ] Refactor the method that checks if no body has been passed to request - move to own module
 - [ ] Add DELETE hander - to delete flag from DynamoDB
 - [ ] Add integration tests
 - [ ] Refactor the code to move all the DynamoDB operations to its own "db/storage" module
 - [ ] Add authentication mechanism for adding/removing/deleting features
 - [ ] Cloudfront - configure the cache time for a very long time
 - [ ] Add a clear cache trigger when the DynamoDB records is added/removed/updated
 - [ ] Think of authentication mechanism for adding/removing/deleting features - for initial working scenario document and possibly add some scripts to talk to DynamoDB via AWS-SDK
 - [ ] Document and possibly try to automate attaching a domain name

## Long term ideas
 - [ ] Explore how this can be integrated with MVT frameworks, and what it takes to build one
