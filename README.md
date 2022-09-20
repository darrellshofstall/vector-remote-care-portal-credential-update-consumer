## Vector Base CDK Code

This project creates a codebuild and codepipeline for the repo. 
The codepipeline will be looking at code changes and deploying into accounts.

## Things to change 

Remove branch from .github/workflows/deploy.yml
```
on:
    push:
        branches:
            - any
```
If you want to add CDK Code you should do it in /cdk/stack.js

Replace the repositoryName = 'vector-base-node-cdk' in bin/repository.js with the name of your repository.
