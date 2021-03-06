
(function() {
	tinymce.PluginManager.requireLangPack('quail');

	tinymce.create('tinymce.plugins.QuailPlugin', {

  	active : false,
  	
		init : function(ed, url) {
  		var that = this;

			ed.addCommand('CheckContent', function() {
				if(that.active) {
  				that.removeMarkup(ed);
  				that.active = false;
				}
				else {
  			  that.checkContents(ed);
  			  that.active = true;
				}
			});

			ed.addButton('quail', {
				title : 'quail.desc',
				cmd : 'CheckContent',
				image : url + '/img/quail.png'
			});

			ed.onNodeChange.add(function(ed, cm) {
				cm.setActive('quail', that.active);
			});
			
		  ed.onSetContent.add(function() {
				that.removeMarkup(ed);
			});

			ed.onBeforeGetContent.add(function() {
				that.removeMarkup(ed);
			});

			ed.onBeforeExecCommand.add(function(ed, cmd) {
				if (cmd == 'mceFullScreen') {
				  that.removeMarkup(ed);
				}
			});
			
		  if (ed.settings.content_css !== false) {
				ed.contentCSS.push(url + '/css/content.css');
		  }
		},
		
		checkContents : function(ed) {
		  (function($) {
			  var options = ed.settings.quailOptions;
			  if(typeof options.testFailed !== 'object') {
				  options.testFailed = function(event) {
				    event.element.addClass('quail-result')
	                       .addClass(event.severity);
	          if(typeof(options.tinyMCEMessage === 'object')) {
  	          var message = options.tinyMCEMessage(event);
  	          event.element.hover(function() {
  	            var $message =  $('<div class="quail-message">' + message + '</div>');
  	            var position = event.element.position();
  	            $message.css('top', position.top + 5 + 'px')
  	                    .css('left', position.left + event.element.width() + 5 + 'px');
  	            event.element.after($message);
  	          },
  	          function() {
  	            event.element.next('.quail-message').remove();
  	          });
    	       
	          }             
				  };
			  }
			  
				$(ed.dom.doc.activeElement).quail(options);
		  })(jQuery);
		},
		
		removeMarkup : function(ed) {
  		(function($) {
    		$(ed.dom.doc.activeElement).find('.quail-result').each(function() {
      		$(this).removeClass('quail-result')
      		       .removeClass('severe')
      		       .removeClass('moderate')
      		       .removeClass('suggestion')
      		       .unbind('hover');
    		});
    		$(ed.dom.doc.activeElement).find('.quail-message').remove();
  		})(jQuery);
		},
		
		createControl : function(n, cm) {
			return null;
		},


		getInfo : function() {
			return {
				longname : 'QUAIL',
				author : 'Kevin Miller',
				authorurl : 'http://github.com/kevee/quail',
				infourl : 'http://github.com/kevee/quail',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('quail', tinymce.plugins.QuailPlugin);
})();