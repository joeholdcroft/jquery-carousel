(function( $ ){
	var methods = {
		init : function(options) {
			var self     = this,
				defaults = {
					arrows    : false,   // Show arrow controls
					indicators: true,    // Show position indicators / controls
					infinite  : false,   // Imitate an infinite carousel (no start and end)
					animation : 'slide', // Animation to use for moving between slides
					speed     : 100,     // Speed in milliseconds for the animation
					interval  : false,   // Interval for automatically moving between slides

					onReady      : false, // Callback for when the plugin is initialised
					onChangeStart: false, // Callback for the start of the slide change animation
					onChangeEnd  : false, // Callback for the end of the slide change animation
					onComplete   : false, // Callback for the end of the slides being reached
					onInteraction: false  // Callback for when a user interacts with any controls
				},
				settings = $.extend({}, defaults, options);

			/**
			 * Checks if a variable is a valid object with named properties
			 * passed in the 'arrows' option.
			 *
			 * The object must have a property named 'next' and one either named
			 * 'prev' or 'previous'. The value of both of these must be a jQuery
			 * object.
			 *
			 * @param  mixed input The variable to check
			 * @return boolean     True if the input is valid, false otherwise
			 */
			function isArrowControlObject(input)
			{
				if (typeof input !== 'object') {
					return false;
				}

				if (!input.hasOwnProperty('next') || !(input.next instanceof jQuery)) {
					return false;
				}

				if (!input.hasOwnProperty('previous') || !(input.previous instanceof jQuery)) {
					if (!input.hasOwnProperty('prev') || !(input.prev instanceof jQuery)) {
						return false;
					}
				}

				return true;
			}

			return this.each(function() {
				var $this = $(this),
					state = {
						settings  : settings,
						indicators: false,
						arrows    : {
							previous: false,
							next    : false
						},
						interval  : false,
						slideCount: $this.children().length,
						current   : 0
					};

				// Validate the settings
				if (settings.animation !== 'slide') {
					$.error('Unsupported animation type for jQuery.carousel: ' + settings.animation);
				}

				// Wrap slides in an element we can use as a "window" to the slides
				$this.wrap($('<div>'));

				var wrap = $this.parent();

				// Get the first slide to use for measuring
				var firstSlide = $this.children(':first');

				// Set the basic structural styling for the carousel
				wrap.css({
					width   : firstSlide.width(),
					height  : firstSlide.height(),
					overflow: 'hidden'
				});

				$this.css({
					float: 'left',
					width: firstSlide.width() * state.slideCount
				});

				$this.children().css({
					display: 'block',
					float  : 'left'
				});
				// determine width/height of first slide
				// set that on the window, set big width on the ul

				// Initialise arrow controls
				if (settings.arrows !== false) {
					// An object with named properties for next & previous/prev
					if (isArrowControlObject(settings.arrows)) {
						state.arrows.next     = settings.arrows.next;
						state.arrows.previous = (settings.arrows.hasOwnProperty('previous')) ? settings.arrows.previous : settings.arrows.prev;
					}
					// An array with two elements, the first is assumed the prev control
					else if (typeof settings.arrows === 'object' && settings.arrows.length === 2) {
						state.arrows.next     = settings.arrows[1];
						state.arrows.previous = settings.arrows[0];
					}
					// Generate the arrows
					else if (settings.arrows === true) {
						state.arrows.next     = $('<p class="arrow next">Next</p>').insertAfter(wrap);
						state.arrows.previous = $('<p class="arrow previous">Previous</p>').insertAfter(wrap);
					}

					// Set events for the arrow controls
					state.arrows.next.on('click.carousel', function() {
						methods.goToNext.call(self);
					});
					state.arrows.previous.on('click.carousel', function() {
						methods.goToPrevious.call(self);
					});
				}

				// Initialise indicators
				if (settings.indicators !== false) {
					var indicatorHTML = $('<ol class="indicators"></ol>');

					// Create each indicator
					$this.children().each(function() {
						indicatorHTML.append($('<li></li>').click(function() {
							methods.goTo.call(self, $(this).index());
						}));
					});

					// jQuery selector for the destination of the indicators
					if (typeof settings.indicators === 'object' && settings.indicators instanceof jQuery) {
						state.indicators = indicatorHTML.insertAfter(settings.indicators.html);
					}
					// Generate the indicators
					else if (settings.indicators === true) {
						state.indicators = indicatorHTML.insertAfter(wrap);
					}
				}

				console.log(state);

				// if (typeof settings.onHover === 'function') {
				// 	$this.on('mouseover', settings.onHover);
				// }

				// set up the interval if required (and put in data)
				// set up events for hover and interaction
				// add class of initialised once done
				//

				// Save state on the element for use later
				$this.data('carousel', state);
				console.log(state);

				// Set initialised class
				$this.addClass('carousel-initialised');

				// Fire the onReady event, if defined
				if (typeof settings.onReady === 'function') {
					settings.onReady($this);
				}
			});
		},
		goTo : function(slideIndex) {
			index = Number(slideIndex);

			return this.each(function() {
				var self   = $(this),
					state  = self.data('carousel'),
					offset = (100 / state.slideCount) * index;

				// Validate the index
				if (isNaN(index) || index < 0 || index >= state.slideCount) {
					$.error('Invalid slide reference on jQuery.carousel.goTo: ' + slideIndex);
				}

				// Set the current state
				state.current = index;

				// Animate the change of slide
				self.animate({marginLeft: '-' + (100 * index) + '%'}, state.settings.speed);
			});
		},
		goToStart : function() {
			// call goTo(0)
		},
		goToEnd : function() {
			// call goTo with the last index
		},
		goToNext : function() {
			console.log('go to next');
		},
		goToPrevious : function() {
			console.log('go to prev');
		},
		start : function() {
			// start the interval
		},
		stop : function() {
			// stop the interval
		}
	};

	$.fn.carousel = function(method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.carousel');
		}
		// hover pause?
		// methods for goTo(index) / goToStart / goToEnd
		// methods for stop / start with intervals
		// ensure widths are re-calculated on orientation change
	};
})(jQuery);