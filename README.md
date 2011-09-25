A simple actor library for node.

```javascript

var simpleActor = require("simple-actor"),
	messages = null,
	actorFactory = null,
	promise = null,
	echoActor = null;

actorFactory = new (simpleActor.ActorFactory)(simpleActor.Promise);

messages = {
	'echo' : function(data,cb){
		cb(data);
	}
};

echoActor = actorFactory.construct(messages,'echo-service');

promise = echoActor('echo',"Hello");

promise.then(function(data){
	console.log(data); //Hello
});

/* To retrive an actor by 'id'.*/

echoActor = actorFactory.get('echo-service');
```
