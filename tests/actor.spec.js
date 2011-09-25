var ActorFactory = require("../lib/simple-actor").ActorFactory,
	Promise = require("../lib/simple-promise").Promise;

describe("Actor Factory",function(){
	var actor = null;

	it("Constructs ok",function(){
		var actorFactory = new ActorFactory(Promise);

		expect(actorFactory).toBeTruthy();
	});
	
	it("Will Construct From An Object",function(){
		var obj = {},
			actorFactory = new ActorFactory(Promise);

		obj = {
			"echo" : function(data,cb){
				cb(data);
			}
		};

		actor = actorFactory.construct(obj);

		expect(actor).toBeTruthy();
		expect(typeof actor).toEqual("function");
	});

	it("Returns a promise from a send message",function(){
		var rv = null;

		rv = actor('echo',"Hello World");

		expect(typeof rv).toEqual("function");
		expect(rv.then).toBeTruthy();
	});

	it("the test actor echos data",function(){
		var rv = null,
			data = false;

		runs(function(){
			rv = actor('echo',"Hello World");
			rv.then(function(str){
				data = str;
			});
		});

		waitsFor(function(){
			return data ? true : false;
		});

		runs(function(){
			expect(data).toEqual("Hello World");
		});
	});

	it("Waits for one operation before beginning the next",function(){
		var counter = 0,
			actorFactory = new ActorFactory(Promise),
			tmpPromoise = null,
			actor = null,
			done = false,
			one = null,
			two = null,
			methods = {};

		methods = {
			"increment" : function(data,cb){
				counter++;
				tmpPromise = cb;
			}
		};

		actor = actorFactory.construct(methods);

		runs(function(){
			one = actor('increment');
			two = actor('increment');
			setTimeout(function(){
				done = true;
			},10);
		});

		waitsFor(function(){
			return done;
		});

		runs(function(){
			done = false;
			expect(counter).toEqual(1);
			tmpPromise();
			setTimeout(function(){
				done = true;
			},10);
		});

		waitsFor(function(){
			return done;
		});

		runs(function(){
			expect(counter).toEqual(2);
		});
	});

	it("Should retrive and actor by it's id.",function(){
		var actorFactory = new ActorFactory(Promise),
			one = null,
			two = null,
			messages = {};

		one = actorFactory.construct(messages,"one");

		two = actorFactory.get("one");

		expect(one).toEqual(two);
	});
});
