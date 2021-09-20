jQuery(document).ready(function ($) {
    $( window ).resize(function() {
        updateOrder();
    });

    updateOrder();


    function getItemsPerRow(){
        if ($( window ).width() > 980) {
            return 3;
        }

        if ($( window ).width() > 737) {
            return 2;
        }

        return 1;
    }

    function updateOrder() {
        $('.image-square').each(function() 				{
            let itemsPerRow = getItemsPerRow();
            let index = $( this ).attr('data-index');
            let rowNumber = Math.floor(index/itemsPerRow);
            let offset = index - (rowNumber*itemsPerRow)

            let order = ((rowNumber * itemsPerRow)*2) + offset;
            $( this ).css('order', order)

        });

        $('.ime-accordion-container').each(function() 				{
            let itemsPerRow = getItemsPerRow();
            let index = $( this ).attr('data-index');
            let rowNumber = Math.floor(index/itemsPerRow);
            let offset = index - (rowNumber*itemsPerRow)

            let order = ((rowNumber * itemsPerRow)*2) + offset + itemsPerRow;
            $( this ).css('order', order)

        });

    }

    $(".ime-accordion-button").each(function () {
        let button = $(this).get(0);
        let isOpen = button.getAttribute('data-start-state') === 'open';

        if (isOpen && !isValidURIHashFriendlyName()) {
            accordionExpand($(this));
        } else {
            $(this).addClass("ime-accordion-closed");
            $(this).removeClass("ime-accordion-open");
        }
    });

    window.onhashchange = function () {
        let hash = location.hash;
        if (hash.length > 1 ) {
            let friendlyName = decodeURIComponent(hash.substr(1, hash.length));
            let hyperlinkButton = $(".ime-accordion-button[data-accordion-friendly-name='" + friendlyName + "']");

            if (hyperlinkButton.get(0)) {
                if (hyperlinkButton.hasClass("ime-accordion-closed")){
                    accordionExpand(hyperlinkButton);
                }

                let parent_id = hyperlinkButton.get(0).getAttribute('data-parent-id');
                let parent =  $(".ime-accordion-button[data-accordion-open-id='" + parent_id + "']");

                let timeOut = 500;
                if (parent.hasClass("ime-accordion-closed")){
                    accordionExpand(parent);
                    timeOut += 500;
                }

                setTimeout(function(){
                    document.getElementById(hyperlinkButton.get(0).getAttribute("data-accordion-open-id")).scrollIntoView();
                    remove_hash_from_url();
                }, timeOut);
            }
        }
    };

    $(document).on("click", '.ime-accordion-button', function(event) {
        accordionExpand($(this));
    });

    $(".ime-accordion-button[href]").click(function () {
        accordionExpand($(this));
    });

    function remove_hash_from_url() {
        var uri = window.location.toString();

        if (uri.indexOf("#") > 0) {
            var clean_uri = uri.substring(0,
                uri.indexOf("#"));

            window.history.replaceState({},
                document.title, clean_uri);
        }
    }

    function isValidURIHashFriendlyName() {
        let hash = location.hash;
        if (hash.length > 1 ) {
            let friendlyName = decodeURIComponent(hash.substr(1, hash.length));
            let hyperlinkButton = $(".ime-accordion-button[data-accordion-friendly-name='" + friendlyName + "']");
            if (hyperlinkButton.get(0)) {
                return true;
            }
        }

        return false
    }

    function accordionExpand(jQueryButton) {
        let button = jQueryButton.get(0);
        let accordionId = button.getAttribute('data-accordion-open-id');

        let jQuerySection = $('#' + accordionId);
        let section = jQuerySection.get(0);
        let openOnly = button.getAttribute('data-open-only') === 'true';

        let radioGroup = button.getAttribute('data-radio-group');

        if (radioGroup) {
            let buttonQueryClass = ".ime-accordion-button.radio_group_button_" + radioGroup;

            if ($(buttonQueryClass + ".ime-wait-for-next-click").length > 0)
            {
                return;
            }

            $(buttonQueryClass).addClass("ime-wait-for-next-click");
			
			$(".ime-accordion-container.radio_group_" + radioGroup).each(function () {
                if (section !== $(this).get(0))
                {
                    collapseSection($(this).get(0));
                }
            });
			
			let isCollapsed = section.getAttribute('data-collapsed') === 'true';
			$(buttonQueryClass).each(function () {
				$(this).addClass("ime-accordion-closed");
				$(this).removeClass("ime-accordion-open");
			});

			// use setTimeout() to execute
			if(isCollapsed) {
				jQueryButton.addClass("ime-accordion-opening");
				expandSection(section);
				jQueryButton.removeClass("ime-accordion-closed");
				jQueryButton.addClass("ime-accordion-open");
				jQueryButton.removeClass("ime-accordion-opening");
			} else if (!openOnly) {
				jQueryButton.addClass("ime-accordion-closing");
				collapseSection(section);
				jQueryButton.addClass("ime-accordion-closed");
				jQueryButton.removeClass("ime-accordion-open");
				jQueryButton.removeClass("ime-accordion-closing");
			}

			// use setTimeout() to execute
			setTimeout(function() {
				$(buttonQueryClass).removeClass("ime-wait-for-next-click");
			} , 500);
        } else {

            let isCollapsed = section.getAttribute('data-collapsed') === 'true';

            if(isCollapsed) {
                jQueryButton.addClass("ime-accordion-opening");
                expandSection(section);
                jQueryButton.removeClass("ime-accordion-closed");
                jQueryButton.addClass("ime-accordion-open");
                jQueryButton.removeClass("ime-accordion-opening");
            } else if (!openOnly) {
                jQueryButton.addClass("ime-accordion-closing");
                collapseSection(section);
                jQueryButton.addClass("ime-accordion-closed");
                jQueryButton.removeClass("ime-accordion-open");
                jQueryButton.removeClass("ime-accordion-closing");
            }
        }
    }

    function collapseSection(element, onComplete) {
        // get the height of the element's inner content, regardless of its actual size
        let sectionHeight = element.scrollHeight;
        element.style.height = 0 + 'px';
		element.setAttribute('data-collapsed', 'true');
				
		if (onComplete) {
			onComplete();
		}
    }

    function expandSection(element) {
        // get the height of the element's inner content, regardless of its actual size
        let sectionHeight = element.scrollHeight;

        // have the element transition to the height of its inner content
        element.style.height = sectionHeight + 'px';
        
		// mark the section as "currently not collapsed"
        element.setAttribute('data-collapsed', 'false');
		
		element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

});