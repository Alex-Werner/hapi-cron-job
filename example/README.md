# Testing the exemple : 

Start server with environment: 

- On windows
```
set NODE_ENV=staging&& node index.js
```
PS: Be sure that NODE_ENV=staging does not have any space after (or it will be considered as part of the ENVName)
- On debian
```
export NODE_ENV staging && node index.js
```