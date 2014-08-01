

function PageLoader(  params ){

  this.params = _.defaults( params || {}, {

  });

  this.doneLoading = false;
  
  this.numberLoaded = 0;
  this.numberToLoad = 0;//this.params.numberToLoad;

  this.percentage  = 0;
  
}

PageLoader.prototype.addLoad = function(){
  
  this.numberToLoad ++;

  this.updatePercentage();

}

PageLoader.prototype.onLoad = function(){

  this.numberLoaded ++;

  this.updatePercentage();
  if( this.numberLoaded == this.numberToLoad ){
    this.onStart();
    console.log('sasdss');
  }

  if( this.numberLoaded > this.numberToLoad ){

    console.log( 'THIS LOADER OVERLOADED' );

  }

}

PageLoader.prototype.onStart = function(){}

PageLoader.prototype.updatePercentage = function(){

  this.percentage = this.numberLoaded / this.numberToLoad;

}


