
$(document).ready(function(){

	/* Close sidebar when pressing Enter inside search (mobile UX) */
	$('#sidebarSearch').on('keydown', function(e){

	/* only Enter key */
	if(e.key === 'Enter'){

		/* close menu */
		$('#index').removeClass('open');

		/* restore closed icon */
		$('#toggleMenu').html(svgClosed);

		/* optional: remove focus to hide mobile keyboard */
		this.blur();
	}
	});

	const svgClosed = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"/></svg>`;
    const svgOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"/></svg>`;

    $('#toggleMenu').on('click', function(){
        $('#index').toggleClass('open');
		// Toggle the SVG inside the button
        $(this).html( $('#index').hasClass('open') ? svgOpen : svgClosed );
    });

    // Initial: SVG closed
    $('#toggleMenu').html(svgClosed);

	/* Smooth scroll */
	$(document).on('click','a[href^="#"]:not([data-no-smooth])',function(e){
		e.preventDefault();
		let target = $($(this).attr('href'));
		if(target.length){
			$('html,body').animate({
				scrollTop: target.offset().top - 90
			}, 600);
		}
		if(window.innerWidth < 900){
			$('#index').removeClass('open');
			$('#toggleMenu').html(svgClosed);
		}
	});

	/* Active menu on scroll */
	$(window).on('scroll', function(){
		let scrollPos = $(document).scrollTop();
		$('.category').each(function(){
			let top = $(this).offset().top - 100;
			let bottom = top + $(this).outerHeight();
			if(scrollPos >= top && scrollPos <= bottom){
				$('#index a').removeClass('active');
				$('#index a[href="#'+this.id+'"]').addClass('active');
			}
		});

		if(scrollPos > 300){
			$('#backToTop').fadeIn();
		}else{
			$('#backToTop').fadeOut();
		}
	});

	/* Hover highlight */
	$('.category').on('mouseenter', function(){
		$('#index a').removeClass('active');
		$('#index a[href="#'+this.id+'"]').addClass('active');
	});

	/* Back to top */
	$('#backToTop').on('click', function(){
		$('html,body').animate({ scrollTop:0 },600);
	});


/* =========================
   BANNER FADE — STABLE
========================= */

let bannerIndex = 1;
const totalBanners = 3;
const fadeDuration = 1000;
const delayBetween = 3000;

let bannerTimer = null;
let initialized = false;

const $main = $('#bannerImage');
const $next = $('#bannerImageNext');
const $container = $('#topBannerPicture');

function getBannerPath(index){
    const w = window.innerWidth;
    let size = 'large';

    if(w <= 599) size = 'mobile';
    else if(w <= 899) size = 'tablet';
    else if(w <= 1199) size = 'desktop';

    return `banner${index}-${size}.png`;
}

function setContainerHeight(){
    $container.height($main.height());
}

function scheduleNext(){
    bannerTimer = setTimeout(updateBanner, delayBetween);
}

function updateBanner(){

	const nextIndex = bannerIndex < totalBanners ? bannerIndex + 1 : 1;
	const nextPath = getBannerPath(nextIndex);

	/* preload off-DOM to avoid mobile flicker or broken icon */
	const preload = new Image();

	preload.onload = function(){

		$next
			.attr('src', nextPath)
			.css({ opacity:0, display:'block' })
			.fadeTo(fadeDuration, 1, function(){

				$main.attr('src', nextPath);

				$next.hide().css('opacity',0);

				bannerIndex = nextIndex;

				setContainerHeight();
				scheduleNext();
			});
	};

	preload.src = nextPath;
}

/* INIT — banner animation */
$main
    .off('load')
    .on('load', function(){
        setContainerHeight();

        if(!initialized){
            initialized = true;

			// Small delay to stabilize the first frame
            setTimeout(scheduleNext, delayBetween);
        }
    })
    .attr('src', getBannerPath(bannerIndex));

/* Resize — do NOT change image source */
$(window).on('resize', function(){
    setContainerHeight();
});

// Pause/resume banner rotation when switching tabs
document.addEventListener('visibilitychange', function(){
    clearTimeout(bannerTimer);
    if(!document.hidden){
        setTimeout(scheduleNext, delayBetween);
    }
});

});



document.addEventListener("DOMContentLoaded", () => {
	const menuLinks = document.querySelectorAll("#index a");
	const sections = [...menuLinks].map(link =>
		document.querySelector(link.getAttribute("href"))
	);

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if(entry.isIntersecting){
				menuLinks.forEach(l => l.classList.remove("active"));
				const activeLink = document.querySelector(
					`#index a[href="#${entry.target.id}"]`
				);
				if(activeLink) activeLink.classList.add("active");
			}
		});
	}, {
		rootMargin: "-40% 0px -50% 0px",
		threshold: 0
	});

	sections.forEach(section => {
		if(section) observer.observe(section);
	});
});



(function(){

	const input = document.getElementById('sidebarSearch');
	const countEl = document.getElementById('searchCount');
	const contentRoot = document.querySelector('body');

	let currentHits = [];

	function clearHighlights(){
		currentHits.forEach(span => {
			const parent = span.parentNode;
			parent.replaceChild(document.createTextNode(span.textContent), span);
			parent.normalize();
		});
		currentHits = [];
		countEl.textContent = '';
	}

	function highlight(text){
		if(!text) return;

		const walker = document.createTreeWalker(
			contentRoot,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode(node){
					if(!node.parentNode) return NodeFilter.FILTER_REJECT;
					if(['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(node.parentNode.tagName))
						return NodeFilter.FILTER_REJECT;
					if(node.parentNode.classList?.contains('search-hit'))
						return NodeFilter.FILTER_REJECT;
					if(!node.nodeValue.toLowerCase().includes(text))
						return NodeFilter.FILTER_REJECT;
					return NodeFilter.FILTER_ACCEPT;
				}
			}
		);

		let firstMatch = null;
		let total = 0;

		while(walker.nextNode()){
			const node = walker.currentNode;
			const value = node.nodeValue;
			const lower = value.toLowerCase();
			const index = lower.indexOf(text);

			if(index === -1) continue;

			const range = document.createRange();
			range.setStart(node, index);
			range.setEnd(node, index + text.length);

			const span = document.createElement('span');
			span.className = 'search-hit';
			range.surroundContents(span);

			currentHits.push(span);
			total++;

			if(!firstMatch) firstMatch = span;
		}

		if(total){
			countEl.textContent = `${total} result${total > 1 ? 's' : ''} found`;
		}else{
			countEl.textContent = 'No results';
		}

		if(firstMatch){
			firstMatch.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
		}
	}

	input.addEventListener('input', function(){
		const value = this.value.trim().toLowerCase();
		clearHighlights();
		if(value.length >= 2){
			highlight(value);
		}
	});

})();


(function(){

	const mapHosts = [...document.querySelectorAll(".career-path-map")];
	if(!mapHosts.length) return;

	const tracks = [
		{ key: "support", color: "#00D15F", glow: "rgba(0,209,95,.28)", href: "SupportTrack.pdf" },
		{ key: "expert", color: "#FD8A26", glow: "rgba(253,138,38,.28)", href: "ExpertTrack.pdf" },
		{ key: "manager", color: "#8E71F4", glow: "rgba(142,113,244,.26)", href: "ManagerTrack.pdf" },
		{ key: "executive", color: "#57E0FF", glow: "rgba(87,224,255,.26)", href: "ExecutiveTrack.pdf" }
	];

	mapHosts.forEach((mapHost, mapIndex) => {
		const svg = mapHost.querySelector("svg");
		if(!svg) return;

		svg.setAttribute("role", "img");
		svg.setAttribute("aria-label", `Career path map ${mapIndex + 1}`);

		// Labels are outlined paths; disable pointer events so clicks hit colored shapes.
		svg.querySelectorAll('[fill="white"], [fill="#FFFFFF"], [fill="#fff"], [fill="black"], [fill="#000"], [fill="#000000"], [fill="#000000FF"]').forEach(node => {
			node.classList.add("track-label");
		});

		tracks.forEach(track => {
			const nodes = svg.querySelectorAll(`[fill="${track.color}"]`);
			nodes.forEach(node => {
				node.classList.add("track-shape", `track-${track.key}`);
				node.setAttribute("data-track-key", track.key);
				node.setAttribute("data-no-smooth", "true");
				node.style.setProperty("--track-glow", track.glow);
			});
		});

		// Arrow connectors use gradient fills (url(#paint...)); map them to track color.
		const gradientTrackMap = {};
		svg.querySelectorAll("defs linearGradient[id]").forEach(gradient => {
			const gradientId = gradient.id;
			const stops = [...gradient.querySelectorAll("stop")].map(stop => (stop.getAttribute("stop-color") || "").toUpperCase());
			const track = tracks.find(item => stops.includes(item.color.toUpperCase()));
			if(track){
				gradientTrackMap[gradientId] = track.key;
			}
		});

		[...svg.querySelectorAll('[fill^="url(#paint"]')].forEach(node => {
			const fillValue = node.getAttribute("fill") || "";
			const match = fillValue.match(/^url\(#([^)]+)\)$/);
			if(!match) return;

			const gradientId = match[1];
			const trackKey = gradientTrackMap[gradientId];
			if(!trackKey) return;

			node.classList.add("track-arrow", `track-arrow-${trackKey}`);
			const track = tracks.find(item => item.key === trackKey);
			if(track){
				node.style.setProperty("--track-glow", track.glow);
			}
		});

		let activeTrackKey = null;

		function setTrackFocus(trackKey){
			if(trackKey === activeTrackKey) return;
			activeTrackKey = trackKey;

			svg.querySelectorAll(".track-shape").forEach(node => {
				const isActive = trackKey && node.dataset.trackKey === trackKey;
				node.classList.toggle("track-hover", !!isActive);
				node.classList.toggle("track-muted", !!trackKey && !isActive);
			});

			svg.querySelectorAll(".track-arrow").forEach(node => {
				const isActive = trackKey && node.classList.contains(`track-arrow-${trackKey}`);
				node.classList.toggle("track-hover", !!isActive);
				node.classList.toggle("track-muted", !!trackKey && !isActive);
			});
		}

		svg.addEventListener("mousemove", event => {
			const shape = event.target.closest(".track-shape");
			setTrackFocus(shape ? shape.dataset.trackKey : null);
		});

		svg.addEventListener("mouseleave", () => {
			setTrackFocus(null);
		});

		svg.addEventListener("click", event => {
			const shape = event.target.closest(".track-shape");
			if(!shape) return;

			const track = tracks.find(item => item.key === shape.dataset.trackKey);
			if(!track) return;

			window.open(track.href, "_blank", "noopener,noreferrer");
		});

		const appearDelayStep = 95;
		const arrowPulseLeadMs = 80;
		const arrowPulseStepMs = 130;
		let sequenceIndex = 0;
		let arrowPulseIndex = 0;
		const introNodes = [...svg.querySelectorAll('[fill="black"], [fill="#000"], [fill="#000000"], [fill="#000000FF"]')];

		introNodes.forEach(node => {
			node.classList.add("track-intro");
		});

		function getNodeVisualOrder(node){
			const box = node.getBBox();
			return {
				x: box.x,
				y: box.y
			};
		}

		if(introNodes.length){
			setTimeout(() => {
				introNodes.forEach(node => {
					node.classList.add("track-intro-visible");
				});
			}, sequenceIndex * appearDelayStep);
			sequenceIndex++;
		}

		tracks.forEach(track => {
			const orderedNodes = [...svg.querySelectorAll(`.track-${track.key}`)]
				.sort((a, b) => {
					const aPos = getNodeVisualOrder(a);
					const bPos = getNodeVisualOrder(b);
					const rowGap = Math.abs(aPos.y - bPos.y);
					if(rowGap > 6) return aPos.y - bPos.y;
					return aPos.x - bPos.x;
				});

			orderedNodes.forEach(node => {
				setTimeout(() => {
					node.classList.add("track-visible");
					node.addEventListener("animationend", () => {
						node.classList.add("track-ready");
						node.classList.remove("track-visible");
					}, { once: true });
				}, sequenceIndex * appearDelayStep);
				sequenceIndex++;
			});
		});

		// Arrows animate after all boxes, preserving the same track sequence.
		tracks.forEach(track => {
			const orderedArrows = [...svg.querySelectorAll(`.track-arrow-${track.key}`)]
				.sort((a, b) => {
					const aPos = getNodeVisualOrder(a);
					const bPos = getNodeVisualOrder(b);
					const rowGap = Math.abs(aPos.y - bPos.y);
					if(rowGap > 6) return aPos.y - bPos.y;
					return aPos.x - bPos.x;
				});

			orderedArrows.forEach(node => {
				const revealAt = sequenceIndex * appearDelayStep;
				setTimeout(() => {
					node.classList.add("track-visible");
				}, revealAt);

				// "Living trail": short glow pulse in sequence, after arrows appear.
				setTimeout(() => {
					node.classList.add("track-lit");
					setTimeout(() => {
						node.classList.remove("track-lit");
					}, 360);
				}, revealAt + arrowPulseLeadMs + (arrowPulseIndex * arrowPulseStepMs));

				sequenceIndex++;
				arrowPulseIndex++;
			});
		});
	});

})();
