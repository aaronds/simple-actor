(function(define){
	define(function(require,exports){
		var ActorFactory = null;
		
		exports.ActorFactory = ActorFactory = function(Promise,nextTick){
			nextTick = nextTick || process.nextTick;
		
			var Actor = null,
				actors = [];

			Actor = function(){
				var queue = [],
					active = false,
					send = null,
					poll = null;

				poll = (function(){
					var activeMessage = null,
						message = null,
						data = null,
						fn = null,
						promise = null;

					if(!queue.length){
						active = false;
						return;
					}

					active = true;

					activeMessage = queue.shift();

					message = activeMessage[0];
					data = activeMessage[1];
					promise = activeMessage[2];

					if(typeof this[message] === "function"){
						fn = this[message];
						promise.then(poll);
						return fn.call(this,data,promise);
					}else if(typeof this['receive'] == "function"){
						fn = this['receive'];
						promise.then(poll);
						return fn.call(this,message,data,promise);
					}else{
						return nextTick(poll);
					}
				}).bind(this);

				send = function(msg,data){
					var promise = Promise();

					queue.push([msg,data,promise]);

					if(!active){
						active = true;
						nextTick(poll);
					}

					return promise;
				}

				return send;
			}

			this.construct = function(obj,id){
				var actorIdx = 0,
					actor = null;
				
				actor = Actor.apply(obj);

				if(id){
					actorIdx = actors.reduce(function(found,obj,idx){
						if(found > -1) return found;

						if(obj[0] === id){
							return idx;
						}

						return -1;
					},-1);

					if(actorIdx > -1){
						actors[actorIdx][1] = actor;
					}
				}

				return actor;
			}

			this.get = function(id){
				return actors.reduce(function(found,obj){
					if(found) return found;

					if(obj[0] === id){
						return obj[1];
					}

					return false;
				},false);
			}
		}
	});
})(typeof define === "function" ? define : function(def){
	def({},typeof exports === "undefined" ? this : exports,{});
});
