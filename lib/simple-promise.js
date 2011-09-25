(function(define){

	define(function(require,exports,module){
		var Promise = null;

		exports.Promise = Promise = function(){
			if(!(this instanceof Function)){
				var promise = function(){
					promise.forfill.apply(promise,arguments);
				};
				Promise.apply(promise,arguments);
				return promise;
			}

			this.whens = [];
			this.forfilled = false;
			this.value = false;

			this.when = function(fn,that){
				that = that || this;
				if(this.forfilled){
					fn.apply(that,this.value);
				}else if(that === this){
					this.whens.push(fn);
				}else{
					this.whens.push(fn.bind(that));
				}
			}

			this.then = this.when;

			this.forfill = function(){
				this.forfilled = true;
				this.value = arguments;

				for(var idx in this.whens){
					this.whens[idx].apply(this,arguments);
				}
			}
		}

		Promise.joinToCallback = function(promises,callback,that){
			that = that || this;

			var results = [];

			if(promises.length == 0){
				callback.call(that);
				return;
			}

			for(var i = 0;i < promises.length;i++){
				promises.when(function(){
					var newForfill = !resutls.some(function(res){
						if(res.index == i){
							return true;
						}
						return false;
					});

					if(newForfill){
						results.push({'index' : i,'value' : arguments});

						if(results.length = promises.length){
							results.sort(function(a,b){
								return (a.index - b.index);
							});

							var callbackArgs = results.map(function(res){
								return res.value;
							});

							callback.apply(that,callbackArgs);
						}
					}
				});
			}
		}

		Promise.join = function(promises){
			var promise = Promise()
			Promise.joinToCallback(promises,promise);
			return promise;
		}
	});
})(typeof define === "function" ? define : function(def){
	def(typeof require === "undefined" ? false : require,typeof exports === "undefined" ? this : exports,typeof modules === "undefined" ? {} : modules);
});
