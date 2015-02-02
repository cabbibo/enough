var WagnerLoader = function() {
	
	this.loaded = 0;
	this.toLoad = 0;
	this.shaders = {};
	this.queue = [];
	this.onLoadedCallback = function(){};

}

WagnerLoader.prototype.add = function( id, name ) {

	this.toLoad++;
	this.shaders[ id ] = {
		id: id,
		name: name,
		content: '',
		loaded: false
	}
	this.queue.push( this.shaders[ id ] );

}

WagnerLoader.prototype.processQueue = function() {

	var shader = this.queue.pop();

	var oReq = new XMLHttpRequest();
	oReq.onload = function() {
		this.loaded++;
		shader.content = oReq.responseText;
		if( this.loaded != this.toLoad ) {
			this.processQueue();
		} else {
			this.onLoadedCallback();
		}
	}.bind( this );
	oReq.open( 'get', shader.name, true );
	oReq.send();

}

WagnerLoader.prototype.load = function() {

	this.processQueue();

}

WagnerLoader.prototype.onLoaded = function( callback ) {

	if( this.loaded == this.toLoad ) callback();
	else this.onLoadedCallback = callback;

}

WagnerLoader.prototype.get = function( id ) {

	function WagnerLoaderGetException( message ) {
		this.message = 'Cannot find shader "' + id + '".';
		this.name = "WagnerLoaderGetException";
		this.toString = function() {
			return this.message
		};
	}

	var s = this.shaders[ id ];
	if( !s ) {
		throw new WagnerLoaderGetException( id );
		return;
	} 

	return s.content;

}
